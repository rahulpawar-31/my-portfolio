"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { fadeInUpOnScroll, fadeInXOnScroll } from "@/lib/motion";
import { externalLinkProps, socials, contactEmail } from "@/lib/site";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-sm";

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          {...fadeInUpOnScroll()}
        >
          <SectionHeading
            eyebrow="Get in touch"
            title="Contact Me"
            description="Have a question, a project idea, or just want to say hi? I'd love to hear from you."
            titleClassName="mb-4"
            descriptionClassName="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm leading-relaxed"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          <motion.div
            className="md:col-span-2 space-y-6"
            {...fadeInXOnScroll(-20)}
          >
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Email</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{contactEmail}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">India 🇮🇳</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Socials</p>
              <div className="flex gap-3">
                <a href={socials.github} {...externalLinkProps} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium">GitHub ↗</a>
                <a href={socials.linkedin} {...externalLinkProps} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium">LinkedIn ↗</a>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-400 leading-relaxed">I typically respond within 24 hours. Looking forward to hearing from you!</p>
            </div>
          </motion.div>

          <motion.form
            className="md:col-span-3 flex flex-col gap-4"
            onSubmit={handleSubmit}
            {...fadeInXOnScroll(20, 0.1)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" type="text" placeholder="Your name" value={formData.name} onChange={handleChange} className={inputClass} required />
              <input name="email" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>
            <textarea name="message" placeholder="Tell me about your project or question..." value={formData.message} onChange={handleChange} rows={6} className={inputClass} required />
            <button type="submit" disabled={status === "sending"} className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg">
              {status === "sending" ? "Sending..." : "Send Message →"}
            </button>
            {status === "success" && (
              <motion.div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                ✅ Message sent! I&apos;ll get back to you soon.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                ❌ {errorMessage || "Something went wrong. Please try again."}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
