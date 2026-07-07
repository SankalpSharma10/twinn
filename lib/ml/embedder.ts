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
      this.instance = pipeline(this.task as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export async function generateEmbedding(text: string, onProgress?: (info: any) => void): Promise<number[]> {
  const embedder = await PipelineSingleton.getInstance(onProgress);
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}
