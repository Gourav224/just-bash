import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";

describe("sed n prints in command order", () => {
  it("prints p output before the n auto-print", async () => {
    const env = new Bash();
    const result = await env.exec(
      "printf 'a/b\\na/b\\n' | sed -e 'p;s,.*/,,;n'",
    );
    expect(result).toMatchObject({
      stdout: "a/b\nb\na/b\n",
      stderr: "",
      exitCode: 0,
    });
  });

  it("interleaves =, n and l in command order", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'a\\nb\\nc\\nd\\n' | sed -e '=;n;l'");
    expect(result).toMatchObject({
      stdout: "1\na\nb$\nb\n3\nc\nd$\nd\n",
      stderr: "",
      exitCode: 0,
    });
  });

  it("does not print for n with -n", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'a\\nb\\nc\\n' | sed -n 'p;n'");
    expect(result).toMatchObject({ stdout: "a\nc\n", stderr: "", exitCode: 0 });
  });

  it("keeps a missing final newline when n prints the last line", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'a\\nb\\nc' | sed n");
    expect(result).toMatchObject({
      stdout: "a\nb\nc",
      stderr: "",
      exitCode: 0,
    });
  });
});
