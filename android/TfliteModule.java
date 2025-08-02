// TfliteModule.java
// Native Android module for Gemma-3n 4b TFLite inference
// Place this file in: android/app/src/main/java/com/tamazighttranslate/

package com.tamazighttranslate; // Use your app's package name

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.support.model.Model;
import org.tensorflow.lite.gpu.CompatibilityList;
import org.tensorflow.lite.gpu.GpuDelegate;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;
import java.util.ArrayList;

public class TfliteModule extends ReactContextBaseJavaModule {
    private static final String TAG = "TfliteModule";
    private static final String MODEL_FILE = "gemma-3n-4b-tamazight-ft.tflite";
    private static final String TOKENIZER_FILE = "tokenizer.json";
    
    private Interpreter tflite;
    private Map<String, Object> tokenizerConfig;
    private Map<String, Integer> vocab;
    private Map<Integer, String> reverseVocab;
    private boolean isModelLoaded = false;
    private final ReactApplicationContext reactContext;
    
    // Model configuration
    private static final int MAX_SEQUENCE_LENGTH = 512;
    private static final int VOCAB_SIZE = 32000; // Gemma vocabulary size
    private static final String MODEL_VERSION = "gemma-3n-4b-tamazight-ft-v1.0";

    TfliteModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "TfliteModule";
    }

    /**
     * Initialize the TFLite model and tokenizer
     */
    @ReactMethod
    public void initializeModel(Promise promise) {
        try {
            Log.d(TAG, "Initializing Gemma-3n 4b TFLite model...");
            
            // Load tokenizer configuration
            loadTokenizer();
            
            // Load TFLite model
            loadTFLiteModel();
            
            isModelLoaded = true;
            
            WritableMap result = Arguments.createMap();
            result.putString("status", "success");
            result.putString("modelVersion", MODEL_VERSION);
            result.putString("message", "Model initialized successfully");
            
            Log.d(TAG, "Model initialization completed successfully");
            promise.resolve(result);
            
        } catch (Exception e) {
            Log.e(TAG, "Model initialization failed", e);
            promise.reject("MODEL_INIT_ERROR", "Failed to initialize model: " + e.getMessage());
        }
    }

    /**
     * Run inference for text translation
     */
    @ReactMethod
    public void translateText(String inputText, String fromLanguage, String toLanguage, String context, Promise promise) {
        if (!isModelLoaded) {
            promise.reject("MODEL_NOT_LOADED", "Model not initialized. Call initializeModel first.");
            return;
        }

        try {
            long startTime = System.currentTimeMillis();
            
            // Create translation prompt
            String prompt = createTranslationPrompt(inputText, fromLanguage, toLanguage, context);
            
            // Tokenize input
            int[] inputTokens = tokenizeText(prompt);
            
            // Run inference
            float[][] logits = runInference(inputTokens);
            
            // Decode output
            String translatedText = decodeOutput(logits);
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            // Create result
            WritableMap result = Arguments.createMap();
            result.putString("translatedText", translatedText);
            result.putDouble("confidence", calculateConfidence(logits));
            result.putDouble("processingTime", processingTime);
            result.putString("modelVersion", MODEL_VERSION);
            result.putString("status", "success");
            
            Log.d(TAG, String.format("Translation completed in %dms", processingTime));
            promise.resolve(result);
            
        } catch (Exception e) {
            Log.e(TAG, "Translation failed", e);
            promise.reject("TRANSLATION_ERROR", "Translation failed: " + e.getMessage());
        }
    }

    /**
     * Check if model is ready for inference
     */
    @ReactMethod
    public void isModelReady(Promise promise) {
        WritableMap result = Arguments.createMap();
        result.putBoolean("isReady", isModelLoaded);
        result.putString("modelVersion", isModelLoaded ? MODEL_VERSION : "not_loaded");
        promise.resolve(result);
    }

    /**
     * Get model information and statistics
     */
    @ReactMethod
    public void getModelInfo(Promise promise) {
        WritableMap result = Arguments.createMap();
        result.putString("modelVersion", MODEL_VERSION);
        result.putBoolean("isLoaded", isModelLoaded);
        result.putInt("maxSequenceLength", MAX_SEQUENCE_LENGTH);
        result.putInt("vocabSize", VOCAB_SIZE);
        result.putString("modelFile", MODEL_FILE);
        promise.resolve(result);
    }

    /**
     * Load the TensorFlow Lite model
     */
    private void loadTFLiteModel() throws IOException {
        AssetManager assetManager = reactContext.getAssets();
        AssetFileDescriptor fileDescriptor = assetManager.openFd(MODEL_FILE);
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        MappedByteBuffer modelBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);

        // Configure interpreter options
        Interpreter.Options options = new Interpreter.Options();
        
        // Enable GPU acceleration if available
        CompatibilityList compatList = new CompatibilityList();
        if (compatList.isDelegateSupportedOnThisDevice()) {
            GpuDelegate.Options delegateOptions = compatList.getBestOptionsForThisDevice();
            GpuDelegate gpuDelegate = new GpuDelegate(delegateOptions);
            options.addDelegate(gpuDelegate);
            Log.d(TAG, "GPU acceleration enabled");
        } else {
            // Use multiple threads for CPU inference
            options.setNumThreads(4);
            Log.d(TAG, "Using CPU inference with 4 threads");
        }

        tflite = new Interpreter(modelBuffer, options);
        Log.d(TAG, "TFLite model loaded successfully");
    }

    /**
     * Load tokenizer configuration from assets
     */
    private void loadTokenizer() throws IOException {
        AssetManager assetManager = reactContext.getAssets();
        InputStream inputStream = assetManager.open(TOKENIZER_FILE);
        
        // Read tokenizer JSON
        byte[] buffer = new byte[inputStream.available()];
        inputStream.read(buffer);
        inputStream.close();
        
        String tokenizerJson = new String(buffer, "UTF-8");
        
        // Parse tokenizer configuration
        Gson gson = new Gson();
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        tokenizerConfig = gson.fromJson(tokenizerJson, type);
        
        // Extract vocabulary
        extractVocabulary();
        
        Log.d(TAG, "Tokenizer loaded successfully");
    }

    /**
     * Extract vocabulary from tokenizer config
     */
    private void extractVocabulary() {
        vocab = new HashMap<>();
        reverseVocab = new HashMap<>();
        
        // Extract vocab from tokenizer config
        // This will depend on your specific tokenizer format
        Map<String, Object> model = (Map<String, Object>) tokenizerConfig.get("model");
        if (model != null) {
            Map<String, Double> vocabMap = (Map<String, Double>) model.get("vocab");
            if (vocabMap != null) {
                for (Map.Entry<String, Double> entry : vocabMap.entrySet()) {
                    int tokenId = entry.getValue().intValue();
                    vocab.put(entry.getKey(), tokenId);
                    reverseVocab.put(tokenId, entry.getKey());
                }
            }
        }
        
        Log.d(TAG, String.format("Vocabulary loaded with %d tokens", vocab.size()));
    }

    /**
     * Create translation prompt for the model
     */
    private String createTranslationPrompt(String inputText, String fromLang, String toLang, String context) {
        String contextPrefix = "";
        if ("emergency".equals(context)) {
            contextPrefix = "Emergency translation: ";
        } else if ("government".equals(context)) {
            contextPrefix = "Official translation: ";
        }
        
        return String.format("%sTranslate from %s to %s: %s", contextPrefix, fromLang, toLang, inputText);
    }

    /**
     * Tokenize input text
     */
    private int[] tokenizeText(String text) {
        // Simple tokenization - replace with proper tokenizer implementation
        String[] words = text.toLowerCase().split("\\s+");
        List<Integer> tokens = new ArrayList<>();
        
        for (String word : words) {
            Integer tokenId = vocab.get(word);
            if (tokenId != null) {
                tokens.add(tokenId);
            } else {
                // Handle unknown tokens (UNK)
                tokens.add(vocab.getOrDefault("<unk>", 0));
            }
        }
        
        // Pad or truncate to max sequence length
        int[] result = new int[MAX_SEQUENCE_LENGTH];
        for (int i = 0; i < Math.min(tokens.size(), MAX_SEQUENCE_LENGTH); i++) {
            result[i] = tokens.get(i);
        }
        
        return result;
    }

    /**
     * Run TFLite inference
     */
    private float[][] runInference(int[] inputTokens) {
        // Prepare input tensor
        ByteBuffer inputBuffer = ByteBuffer.allocateDirect(4 * inputTokens.length);
        inputBuffer.order(ByteOrder.nativeOrder());
        for (int token : inputTokens) {
            inputBuffer.putInt(token);
        }

        // Prepare output tensor
        float[][] output = new float[1][VOCAB_SIZE];

        // Run inference
        tflite.run(inputBuffer, output);

        return output;
    }

    /**
     * Decode model output to text
     */
    private String decodeOutput(float[][] logits) {
        StringBuilder result = new StringBuilder();
        
        // Simple greedy decoding - replace with proper decoding strategy
        for (float[] timestep : logits) {
            int maxIndex = 0;
            float maxValue = timestep[0];
            
            for (int i = 1; i < timestep.length; i++) {
                if (timestep[i] > maxValue) {
                    maxValue = timestep[i];
                    maxIndex = i;
                }
            }
            
            String token = reverseVocab.get(maxIndex);
            if (token != null && !token.equals("<pad>") && !token.equals("<eos>")) {
                result.append(token).append(" ");
            }
        }
        
        return result.toString().trim();
    }

    /**
     * Calculate confidence score from logits
     */
    private double calculateConfidence(float[][] logits) {
        double totalConfidence = 0.0;
        int count = 0;
        
        for (float[] timestep : logits) {
            float max = Float.NEGATIVE_INFINITY;
            float sum = 0.0f;
            
            for (float value : timestep) {
                max = Math.max(max, value);
            }
            
            for (float value : timestep) {
                sum += Math.exp(value - max);
            }
            
            float maxProb = (float) Math.exp(max - max) / sum;
            totalConfidence += maxProb;
            count++;
        }
        
        return count > 0 ? totalConfidence / count : 0.0;
    }

    /**
     * Cleanup resources
     */
    @ReactMethod
    public void cleanup(Promise promise) {
        try {
            if (tflite != null) {
                tflite.close();
                tflite = null;
            }
            isModelLoaded = false;
            
            WritableMap result = Arguments.createMap();
            result.putString("status", "success");
            result.putString("message", "Resources cleaned up successfully");
            promise.resolve(result);
            
        } catch (Exception e) {
            promise.reject("CLEANUP_ERROR", "Failed to cleanup: " + e.getMessage());
        }
    }
}
