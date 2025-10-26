import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { toast } from "sonner";

jest.mock('@ffmpeg/ffmpeg', () => {
  const instance = {
    load:     jest.fn().mockResolvedValue(undefined),
    on:       jest.fn(),
    writeFile:jest.fn().mockResolvedValue(undefined),
    exec:     jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue(undefined),
  };

  const FFmpeg = jest.fn(() => instance);
  return { FFmpeg };
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    translate: jest.fn(),
    fill: jest.fn(),
  }),
});

jest.mock("sonner", () => {
  const toastFn = jest.fn() as unknown as typeof toast;
  toastFn.success = jest.fn();
  toastFn.error = jest.fn();
  return { toast: toastFn };
});


describe("Tests for the file drop section", () => {
    it("should upload a valid file", async () => {
        const user = userEvent.setup();
        render(<Home />);
        
        const data = new Uint8Array([1, 2, 3, 4]);
        const file = new File([data], "test.png", { type: "image/png" });

        const input = screen.getByLabelText(/drop-area/i) as HTMLInputElement;   
        
        await user.upload(input, file);
        expect(input.files![0]).toBe(file);
        expect(input.files![0].name).toBe("test.png");
        expect(input.files).toHaveLength(1);
    });
    
    
    it("should not upload an invalid file", async () => {
        const user = userEvent.setup();
        render(<Home />);
        
        const data = new Uint8Array([1, 2, 3, 4]);
        const file = new File([data], "test.txt", { type: "text/plain" });

        const input = screen.getByLabelText(/drop-area/i) as HTMLInputElement;   
        
        await user.upload(input, file);
        expect(screen.queryByText("bad.pdf")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /convert/i })).not.toBeInTheDocument();
    });
});
