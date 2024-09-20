export class Utils {

  public static normalizeName(name: string): string {
    return name.normalize().toLowerCase().replace(/[^a-z ]/g, "").replaceAll(' ', '_');
  }
}