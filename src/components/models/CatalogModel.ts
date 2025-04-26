import { IItem } from '../../types';

export class CatalogModel {
  protected items: IItem[] = [];
  protected preview: IItem | null = null;

  setItems(items: IItem[]) {
    this.items = items;
  }

  getItems(): IItem[] {
    return this.items;
  }

  getItemById(id: string): IItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(item: IItem) {
    this.preview = item;
  }

  getPreview(): IItem | null {
    return this.preview;
  }
}
