"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

const loadingMessages = [
  "✈️ Planning your adventure...",
  "🌍 Exploring hidden gems...",
  "🗺️ Mapping your journey...",
  "🍜 Finding amazing food spots...",
  "🏝️ Taking you somewhere magical...",
  "🎒 Crafting your perfect itinerary..."
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    travelStyle: "",
    companions: "",
    interests: ""
  });

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  type FormField = keyof typeof formData;

  const isSelected = (field: FormField, value: string) =>
    formData[field] === value;

  useEffect(() => {
    if (!loading) return;

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[i]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  async function generateTrip() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setItinerary(data.itinerary);
      setStep(7);
    } catch (err) {
      console.error(err);
      showToast("Error generating trip");
    }

    setLoading(false);
  }

  function next() { setStep(prev => prev + 1); }
  function back() { setStep(prev => prev - 1); }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function copyItinerary() {
    navigator.clipboard.writeText(itinerary);
    showToast("Copied!");
  }

  function downloadPDF() {
    const doc = new jsPDF();
    doc.text(itinerary, 10, 10);
    doc.save("itinerary.pdf");
    showToast("Downloaded PDF");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          AI Travel Planner
        </h1>

        {loading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-800 animate-pulse">
              {loadingMessage}
            </p>
          </div>
        )}

        {!loading && (
          <>
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Where are you travelling?
                </h2>
                <input
                  className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 placeholder-gray-500"
                  placeholder="Tokyo"
                  value={formData.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                />
                <button onClick={next} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                  Next
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  How many days?
                </h2>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-3 rounded-xl text-gray-900"
                  placeholder="5"
                  value={formData.days}
                  onChange={(e) => updateField("days", e.target.value)}
                />
                <div className="flex justify-between mt-6">
                  <button onClick={back}>Back</button>
                  <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Budget</h2>
                {["Budget", "Mid-range", "Luxury"].map((b) => (
                  <button
                    key={b}
                    onClick={() => updateField("budget", b)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-xl ${
                      isSelected("budget", b)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {b}
                  </button>
                ))}
                <div className="flex justify-between mt-6">
                  <button onClick={back}>Back</button>
                  <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Travel Style</h2>
                {["Relaxed", "Adventurous", "Cultural"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateField("travelStyle", s)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-xl ${
                      isSelected("travelStyle", s)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {s}
                  </button>
                ))}
                <div className="flex justify-between mt-6">
                  <button onClick={back}>Back</button>
                  <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Who are you travelling with?
                </h2>
                {["Solo", "Couple", "Friends", "Family"].map((c) => (
                  <button
                    key={c}
                    onClick={() => updateField("companions", c)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-xl ${
                      isSelected("companions", c)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {c}
                  </button>
                ))}
                <div className="flex justify-between mt-6">
                  <button onClick={back}>Back</button>
                  <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Interests
                </h2>
                <input
                  className="w-full border border-gray-300 p-3 rounded-xl text-gray-900"
                  placeholder="Food, Nature, Museums"
                  value={formData.interests}
                  onChange={(e) => updateField("interests", e.target.value)}
                />
                <div className="flex justify-between mt-6">
                  <button onClick={back}>Back</button>
                  <button onClick={generateTrip} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                    Generate
                  </button>
                </div>
              </div>
            )}

            {/* RESULT */}
            {step === 7 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Your Trip
                </h2>

                <div className="space-y-2 text-gray-800">
                  {itinerary.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button onClick={copyItinerary} className="bg-blue-600 text-white py-3 rounded-xl">
                    Copy
                  </button>
                  <button onClick={downloadPDF} className="bg-indigo-500 text-white py-3 rounded-xl">
                    Download PDF
                  </button>
                </div>

                <button onClick={() => setStep(1)} className="mt-4 w-full border py-3 rounded-xl">
                  Plan another trip
                </button>
              </div>
            )}
          </>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}