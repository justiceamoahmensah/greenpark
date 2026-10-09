import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { SelectionCards } from "./SelectionCards";

function ConsentHarness() {
  const [value, setValue] = useState("");
  return (
    <SelectionCards
      name="may_we_contact_you"
      label="May our sales team contact you?"
      options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ]}
      value={value}
      onChange={(next) => setValue(String(next))}
    />
  );
}

describe("selection cards", () => {
  it("does not preselect consent", () => {
    render(<ConsentHarness />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    radios.forEach((radio) => expect(radio).not.toBeChecked());
  });

  it("can be chosen with the keyboard", async () => {
    const user = userEvent.setup();
    render(<ConsentHarness />);
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Yes" })).toBeChecked();
  });
});
