import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are downloading from HuggingFace
env.allowLocalModels = false;

class PipelineSingleton {
  static task = 'feature-extraction';
  // We use Supabase's recommended embedding model for Postgres
  static model = 'Supabase/gte-small';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  // Load the model
  const embedder = await PipelineSingleton.getInstance((x: any) => {
    // Send loading progress back to the main thread
    self.postMessage(x);
  });
  
  // Actually run the ML inference on the user's vibe string!
  const output = await embedder(event.data.text, { pooling: 'mean', normalize: true });
  
  // Return the float array back to the main React thread
  self.postMessage({
    status: 'complete',
    output: Array.from(output.data),
  });
});
