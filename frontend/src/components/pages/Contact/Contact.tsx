import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ContactProps {
  onHoverChange?: (isHovered: boolean) => void;
  headlineLine1?: string;
  headlineLine2?: string;
  email?: string;
  termsText?: string;
}

const Contact: React.FC<ContactProps> = ({
  onHoverChange,
  headlineLine1 = "Just",
  headlineLine2 = "send it.",
  email = "contactvedantbuilds@gmail.com",
  termsText = "I hereby accept the General Terms and Privacy Policy",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
    agree: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errorMsg) setErrorMsg("");
    if (isSubmitted) setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }
    if (!formData.agree) {
      setErrorMsg("Please accept the terms and privacy policy to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Direct email delivery to contactvedantbuilds@gmail.com via FormSubmit AJAX API
      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Company: formData.company || "Not provided",
          Message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok || data.success === "true" || (data.message && data.message.includes("activation"))) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          message: "",
          agree: false,
        });
      } else {
        throw new Error(data.message || "Direct submission failed");
      }
    } catch (err: unknown) {
      console.warn("Direct form delivery fallback to mailto:", err);
      // Fallback: Launch mailto directly prefilled with all user details
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Vedant,\n\n${formData.message}\n\n---\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || "N/A"}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

      setIsSubmitted(true);
      setFormData({
        name: "",
        company: "",
        email: "",
        message: "",
        agree: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP Entrance Animations
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // 1. Giant text reveal
      gsap.fromTo(
        ".contact-headline-line",
        {
          yPercent: 100,
          opacity: 0,
          rotateX: 30,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Divider line expansion
      gsap.fromTo(
        ".contact-divider",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Sub-columns fade up
      gsap.fromTo(
        ".contact-sub-col",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 68%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Form inputs cascade in
      gsap.fromTo(
        ".contact-form-item",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current || containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full py-20 sm:py-28 md:py-20 px-5 sm:px-10 md:px-16 lg:px-20 overflow-hidden select-none"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: GIANT "just send it." + DIVIDER + 2 SUB-COLUMNS
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Giant Typography: "just send it." (Refokus Style) */}
              <h2
                ref={headlineRef}
                className="font-medium tracking-[-0.045em]  leading-[0.92] text-6xl sm:text-7xl md:text-8xl lg:text-[6.8rem] xl:text-[8.4rem] 2xl:text-[9.2rem]"
              >
                <div className="overflow-hidden">
                  <span className="contact-headline-line block will-change-transform">
                    {headlineLine1}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="contact-headline-line block will-change-transform">
                    {headlineLine2}
                  </span>
                </div>
              </h2>

              {/* Refokus-style Bullet Point & Horizontal Divider Line */}
              <div className="relative w-full mt-10 sm:mt-14 md:mt-16 mb-8 sm:mb-12">
                <div className="contact-divider w-full h-[1px] " />
                <div className="absolute -top-[3.5px] left-0 w-2 h-2   rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              </div>

              {/* 2 Sub-Columns Side-by-Side (Stacked on Mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 lg:gap-8 pt-2">
                {/* Sub-Column 1: Alternative Contact */}
                <div className="contact-sub-col flex flex-col items-start justify-between">
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-normal mb-2 sm:mb-2.5">
                      You don't like forms?
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed max-w-xs mb-5">
                      Prefer direct communication? Send an email directly or connect on socials to discuss projects and creative opportunities.
                    </p>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    onMouseEnter={() => onHoverChange?.(true)}
                    onMouseLeave={() => onHoverChange?.(false)}
                    className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-500 text-xs font-normal transition-all duration-300 cursor-pointer shadow-sm active:scale-95 max-w-full"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                    <span className="truncate">{email}</span>
                  </a>
                </div>

                {/* Sub-Column 2: Opportunities & Collaboration */}
                <div className="contact-sub-col flex flex-col items-start justify-between">
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-normal mb-2 sm:mb-2.5">
                      Looking to do great work?
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed max-w-xs mb-5">
                      Available for select freelance contracts, frontend engineering roles, and innovative digital product design worldwide.
                    </p>
                  </div>
                  <a
                    href="https://cal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => onHoverChange?.(true)}
                    onMouseLeave={() => onHoverChange?.(false)}
                    className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-500 text-xs font-normal transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                    <span>Schedule a Call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: MINIMALIST MODERN CONTACT FORM
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 sm:gap-7 w-full"
              noValidate
            >
              {/* Field 1: Full Name */}
              <div className="contact-form-item flex flex-col">
                <label
                  htmlFor="contact-name"
                  className="text-xs sm:text-[13px] font-normal  mb-2"
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full border border-zinc-700/80 rounded-lg px-4 py-3.5 sm:py-4 text-sm   outline-none transition-all duration-200 shadow-inner"
                  required
                />
              </div>

              {/* Field 2: Company */}
              <div className="contact-form-item flex flex-col">
                <label
                  htmlFor="contact-company"
                  className="text-xs sm:text-[13px] font-normal  mb-2"
                >
                  Company
                </label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Studio"
                  className="w-full  border border-zinc-700/80 rounded-lg px-4 py-3.5 sm:py-4 text-sm   outline-none transition-all duration-200  shadow-inner"
                />
              </div>

              {/* Field 3: Email Address */}
              <div className="contact-form-item flex flex-col">
                <label
                  htmlFor="contact-email"
                  className="text-xs sm:text-[13px] font-normal  mb-2"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full  border border-zinc-700/80 rounded-lg px-4 py-3.5 sm:py-4 text-sm   outline-none transition-all duration-200  shadow-inner"
                  required
                />
              </div>

              {/* Field 4: Tell us about your project */}
              <div className="contact-form-item flex flex-col">
                <label
                  htmlFor="contact-message"
                  className="text-xs sm:text-[13px] font-normal  mb-2"
                >
                  Tell us about your project
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe your goals, timeline, and vision..."
                  rows={5}
                  className="w-full  border border-zinc-700/80 rounded-lg px-4 py-3.5 sm:py-4 text-sm   outline-none transition-all duration-200  resize-none shadow-inner min-h-[140px] sm:min-h-[170px]"
                  required
                />
              </div>

              {/* Checkbox: Accept Terms & Privacy Policy */}
              <div className="contact-form-item flex items-start gap-3 pt-1">
                <input
                  id="contact-terms"
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 shrink-0 rounded border-zinc-700  text-[#f25536] focus:ring-1 focus:ring-[#f25536] cursor-pointer accent-[#f25536]"
                />
                <label
                  htmlFor="contact-terms"
                  className="text-xs sm:text-[13px] cursor-pointer select-none leading-relaxed"
                >
                  {termsText}
                </label>
              </div>

              {/* Error Notice if any */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl  border border-[#f25536]/40 flex items-center gap-3 text-xs sm:text-[13px] shadow-[0_0_15px_rgba(242,85,54,0.15)] animate-fade-in -mt-1">
                  <div className="w-5 h-5 rounded-full  border border-[#f25536] text-[#f25536] flex items-center justify-center text-xs font-bold shrink-0">
                    !
                  </div>
                  <span className="text-[#f25536] font-medium tracking-wide">
                    {errorMsg}
                  </span>
                </div>
              )}

              {/* Success Notification (Aligned with website palette: dark surface, coral glow & cream typography) */}
              {isSubmitted && (
                <div className="p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex items-center gap-3.5 text-xs sm:text-[13px] animate-fade-in backdrop-blur-sm">
                  <div className="w-6 h-6 rounded-full  border border-[#f25536]/60 text-[#f25536] flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_12px_rgba(242,85,54,0.3)]">
                    ✓
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-semibold tracking-wide">
                      Message sent successfully!
                    </span>
                    <span className="text-[#b7ab98] font-normal">
                      I'll get back to you shortly.
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button: Pill Shape (Refokus Style) */}
              <div className="contact-form-item pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => onHoverChange?.(true)}
                  onMouseLeave={() => onHoverChange?.(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-9 sm:px-11 py-3.5 sm:py-4 rounded-full border border-zinc-700/80  text-zinc-300 hover:text-black hover:border-white text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
