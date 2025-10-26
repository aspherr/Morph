import { render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/navbar";
import Toggle from '@/components/toggle';
import Feedback from '@/components/feedback';

jest.mock("next-themes", () => {
  const setTheme = jest.fn();
  return {
    __esModule: true,
    useTheme: () => ({ setTheme }),
    _internal: { setTheme },
  };
});


describe("Tests for the navbar", () => {
    it("should render the github link correctly", async () => {
      render(<Navbar />);
      const link = screen.getByRole('link', { name: /github/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://github.com/aspherr/Morph');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    describe("Tests theme toggle", () => {
      let setTheme: jest.Mock;

      beforeEach(() => {
        const nt = require("next-themes");
        setTheme = nt._internal.setTheme;
        setTheme.mockClear();
      });

      it("should switch to light mode", async () => {
        render(<Toggle />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));
        await user.click(await screen.findByRole("menuitem", { name: /light/i }));

        expect(setTheme).toHaveBeenCalledTimes(1);
        expect(setTheme).toHaveBeenCalledWith("light");
      });

      it("should switch to dark mode", async () => {
        render(<Toggle />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));
        await user.click(await screen.findByRole("menuitem", { name: /dark/i }));

        expect(setTheme).toHaveBeenCalledTimes(1);
        expect(setTheme).toHaveBeenCalledWith("dark");
      });

      it("should switch to system mode", async () => {
        render(<Toggle />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));
        await user.click(await screen.findByRole("menuitem", { name: /system/i }));

        expect(setTheme).toHaveBeenCalledTimes(1);
        expect(setTheme).toHaveBeenCalledWith("system");
      });
    });

    describe("Tests for the feedback form", () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as any);

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should render a textbox with a submit button", async () => {
        const user = userEvent.setup();
        render(<Feedback />);
        
        await user.click(screen.getByRole("button", { name: /feedback/i }));
        const textarea = screen.getByLabelText(/ideas to improve the page/i);
        
        expect(textarea).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
      });

      it("should send with a message attached", async () => {
        const user = userEvent.setup();
        render(<Feedback />);

        await user.click(screen.getByRole("button", { name: /feedback/i }));
        const textarea = screen.getByLabelText(/ideas to improve the page/i);
        
        await user.type(textarea, "This is a test...");
        await user.click(screen.getByRole("button", { name: /send/i }));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(global.fetch).toHaveBeenCalledWith(
          "/api/feedback",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: expect.stringContaining("This is a test..."),
          })
        );
      });

      it("should not send without a message attached", async () => {
        const user = userEvent.setup();
        render(<Feedback />);

        await user.click(screen.getByRole("button", { name: /feedback/i }));
        const textarea = screen.getByLabelText(/ideas to improve the page/i);

        await user.type(textarea, "  ");
        await user.click(screen.getByRole("button", { name: /send/i }));

        expect(global.fetch).not.toHaveBeenCalled();
      });
    });
});
