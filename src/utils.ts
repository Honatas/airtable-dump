export class Utils {

  public static normalizeName(name: string): string {
    return name.normalize().toLowerCase().replace(/[^a-z0-9 ]/g, "").replaceAll(' ', '_');
  }
}