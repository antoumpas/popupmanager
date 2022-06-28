import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Popup from "../Popup.vue";

const HTML_CONTENT = '<div id="test">Content</div>'

describe("Popup", () => {
  it("should be able to load html", async () => {
    const wrapper = mount(Popup, {props: {modelValue: true, content: HTML_CONTENT}});
    expect(wrapper.find("#test").html()).toContain('Content');
  });
});
