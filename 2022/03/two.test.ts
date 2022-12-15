import { assertEquals } from "std/testing/asserts.ts";
import { two } from "./two.ts";

Deno.test("two", async () => {
  {
    const sum = await two("03/input.sample.txt");
    assertEquals(sum, 70);
  }
  {
    const sum = await two("03/input.txt");
    assertEquals(sum, 2552);
  }
});
