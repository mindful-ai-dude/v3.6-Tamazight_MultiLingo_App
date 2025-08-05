## How the React Native/Expo app is structured for MediaPipe LlmInference integration:

## Current App Structure 📱

````json path=app.json mode=EXCERPT
{
  "expo": {
    "name": "bolt-expo-nativewind",
    "newArchEnabled": true,
    "plugins": ["expo-router", "expo-font", "expo-web-browser"]
  }
}
````

## Planned Native Module Architecture 🔧

### TFLite Bridge Module Structure
````java path=feature-updates-to-add.md mode=EXCERPT
// android/app/src/main/java/com/your-app-name/TfliteModule.java
public class TfliteModule extends ReactContextBaseJavaModule {
    private Interpreter tflite;
    private final ReactApplicationContext reactContext;

    TfliteModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        try {
            tflite = new Interpreter(loadModelFile());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "TfliteModule";
    }
    // ... inference methods
}
````

### Package Registration
````java path=feature-updates-to-add.md mode=EXCERPT
// MainApplication.java
import com.tamazighttranslate.TflitePackage;

@Override
protected List<ReactPackage> getPackages() {
  List<ReactPackage> packages = new PackageList(this).getPackages();
  packages.add(new TflitePackage()); // <-- Add this line
  return packages;
}
````

## MediaPipe Integration Architecture 🤖

### Gradle Dependencies
````gradle path=documentation/Tamazight Multi-Lingo App-Fine-Tuning Gemma-3-4b-it and Gemma-3-1b-it_ A Comprehensive Technical Guide.md mode=EXCERPT
dependencies {
    implementation 'com.google.mediapipe:tasks-genai:0.10.24'
}
````

### LlmInference Initialization
````kotlin path=documentation/Tamazight Multi-Lingo App-Fine-Tuning Gemma-3-4b-it and Gemma-3-1b-it_ A Comprehensive Technical Guide.md mode=EXCERPT
val options = LlmInferenceOptions.builder()
   .setModelPath("/data/local/tmp/llm/your_custom_gemma_model.task")
   .setMaxTokens(1024)
   .setTopK(40)
   .setTemperature(0.8f)
   .build()

val llmInference = LlmInference.createFromOptions(context, options)
````

## JavaScript Integration Layer 🌉

### Native Module Access
````javascript path=feature-updates-to-add.md mode=EXCERPT
import { NativeModules } from 'react-native';

const { TfliteModule } = NativeModules;

const translateText = async (text) => {
  try {
    console.log("Running on-device translation...");
    const result = await TfliteModule.runInference(text);
    console.log("On-device result:", result);
    return result;
  } catch (e) {
    console.error("Error running on-device inference:", e);
    return "Error";
  }
};
````

## Model Deployment Pipeline 📦

### TFLite Model Conversion
````python path=documentation/v3-multilingoapp-tflite-conversion-runpod-correct.ipynb mode=EXCERPT
# Convert fine-tuned PyTorch model to TFLite
edge_model_fp32 = ai_edge_torch.convert(
    traceable_model,
    sample_args=sample_inputs,
    dynamic_shapes=dynamic_shapes
)

# Save as .tflite file
edge_model_fp32.export("gemma-3n-4b-tamazight-ft.tflite")
````

### Task File Packaging
````text path=documentation/Tamazight Multi-Lingo App-Fine-Tuning Gemma-3-4b-it and Gemma-3-1b-it_ A Comprehensive Technical Guide.md mode=EXCERPT
Pipeline: Fine-tuned PyTorch model -> ai-edge-torch conversion -> TFLite model -> Packaged into .task file (with tokenizer) -> Deployed via MediaPipe LlmInference
````

## Current Integration Status 📊

### ✅ **App Foundation Ready:**
- Expo SDK 52 with new architecture enabled
- React Native bridge architecture planned
- Translation interface already built

### 🔧 **Missing Implementation:**
- Native Android module creation
- MediaPipe dependency integration
- Model file deployment system
- Bridge between JS and native inference

### 📋 **Integration Steps Required:**

1. **Create Native Module**
   - `TfliteModule.java` for MediaPipe integration
   - `TflitePackage.java` for React Native registration

2. **Add Dependencies**
   - MediaPipe GenAI library
   - Model file management system

3. **Deploy Models**
   - `.task` files with tokenizer assets
   - Local storage or download mechanism

4. **Connect to UI**
   - Replace mock translation with native calls
   - Add error handling and fallbacks

The app structure is well-prepared for MediaPipe integration, but requires native Android development to complete the on-device AI pipeline.
