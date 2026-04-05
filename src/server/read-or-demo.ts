export async function readOrDemo<T>(reader: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await reader();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      throw error;
    }

    console.error("Falling back to demo data in production:", error);
    return fallback();
  }
}
