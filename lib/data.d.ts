declare module "lib/data" {
  export function fetchItems(): Promise<any[]>;
  export function fetchServices(): Promise<any[]>;
}
