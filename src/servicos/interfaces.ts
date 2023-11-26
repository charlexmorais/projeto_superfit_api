export interface InterfaceCrud<DTO> {
  getAll(): Promise<DTO[]>;
  find(id: string): Promise<DTO | null>; // Pode retornar null se não encontrar o recurso
  create(payload: DTO): Promise<DTO>;
  update(id: string, payload: DTO): Promise<DTO>;
  delete(id: string): Promise<void>; // Retorna true se a exclusão for bem-sucedida, ou false se não for
}
export interface Report<T> {
  get(): Promise<T>;
}

