import { motion } from "framer-motion";

interface Props {
  url: string;
  setUrl: (url: string) => void;
  isAnalyzing: boolean;
  error: string;
  handleAnalyze: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const Form = ({
  url,
  setUrl,
  isAnalyzing,
  error,
  handleAnalyze,
  email,
  setEmail,
}: Props) => (
  <motion.form
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.3 }}
    onSubmit={handleAnalyze}
    className="bg-white rounded-3xl p-8 md:p-10 relative animated-glow"
  >
    <div className="space-y-6">
      {/* URL Input */}
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-semibold text-apple-gray mb-2"
        >
          Page URL
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          required
          disabled={isAnalyzing}
          className="w-full text-apple-gray px-5 py-4 rounded-xl border-2 border-apple-border focus:border-apple-blue focus:outline-none transition-colors text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-apple-gray mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isAnalyzing}
          className="w-full text-apple-gray px-5 py-4 rounded-xl border-2 border-apple-border focus:border-apple-blue focus:outline-none transition-colors text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <p className="mt-2 text-sm text-gray-500">
          See your AI readiness score instantly, no credit card required.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200"
        >
          <p className="text-sm text-red-800">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full bg-gradient-to-r from-apple-blue to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Checking how LLMs see your content...
          </span>
        ) : (
          "Check My AI Visibility"
        )}
      </button>
    </div>

    <p className="mt-6 text-center text-xs text-gray-500">
      GEO Analyzer. Created by{" "}
      <a href="https://www.maxpetrusenko.com/" className="text-apple-blue">
        @max_petrusenko
      </a>{" "}
      <br />. Contact me for a custom AI visibility audit.
    </p>
  </motion.form>
);
