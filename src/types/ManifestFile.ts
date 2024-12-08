export interface ManifestFile {
  id: number;
  name: string;
  contents: Buffer | string;
  platform?: string;
  filePath: string;
  createdAt: string;
  executionTime: number;
}
