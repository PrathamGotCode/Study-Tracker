import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, LineChart, Line
} from "recharts";

export default function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("studyEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [subject, setSubject] = useState("Physics");
  const [hours, setHours] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [trendType, setTrendType] = useState("area");
  const [timeRange, setTimeRange] = useState("daily");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    localStorage.setItem("studyEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const target = new Date("2026-05-03T09:00:00");
    const id = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Exam time!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setTimeLeft(`${days} days ${hrs} hrs left`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const addEntry = () => {
    const h = parseFloat(hours);
    if (!h || h <= 0) return;
    setEntries((prev) => [
      ...prev,
      { subject, hours: h, date: new Date().toISOString() },
    ]);
    setHours("");
  };

  const groupedData = useMemo(() => {
    const acc = {};
    for (const e of entries) {
      const d = new Date(e.date);
      let key;
      if (timeRange === "daily") {
        key = d.toLocaleDateString();
      } else if (timeRange === "weekly") {
        const week = Math.ceil(d.getDate() / 7);
        key = `Week ${week}`;
      } else {
        key = d.toLocaleString("default", { month: "short" });
      }
      if (!acc[key]) acc[key] = { day: key, hours: 0 };
      acc[key].hours += e.hours;
    }
    return Object.values(acc);
  }, [entries, timeRange]);

  const subjectData = useMemo(() => {
    const acc = {};
    for (const e of entries) {
      if (!acc[e.subject]) acc[e.subject] = { name: e.subject, hours: 0 };
      acc[e.subject].hours += e.hours;
    }
    return Object.values(acc);
  }, [entries]);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 16, fontFamily: "system-ui" }}>
      {/* Top Shlok */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          कृष्णस्य नामे सर्वविघ्ननाशः।
        </div>
        <div style={{ width: 80, height: 1, background: "rgba(255,255,255,0.5)", margin: "6px auto" }} />
        <div style={{ color: "#aaa", fontSize: 12 }}>
          Krishna’s name removes all obstacles.
        </div>
      </div>

      {/* Header */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: 1 }}>NEET TIMER</div>
          <div style={{ fontSize: 18, color: "#93c5fd", fontWeight: 600 }}>{timeLeft}</div>
        </div>
        <div style={{ position: "relative" }}>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Player Name"
            style={{ background: "#111", border: "1px solid #60a5fa", color: "#fff", padding: "8px 12px", borderRadius: 10 }}
          />
          <div style={{ position: "absolute", top: -8, left: 10, fontSize: 10, color: "#60a5fa", background: "#000", padding: "0 4px" }}>PLAYER</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: "#111", padding: 12, borderRadius: 12, marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ background: "#222", color: "#fff", padding: 6, borderRadius: 8 }}>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Biology</option>
        </select>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours"
          style={{ background: "#222", color: "#fff", padding: 6, borderRadius: 8, width: 100 }}
        />
        <button onClick={addEntry} style={{ background: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: 8, color: "#fff" }}>
          Add
        </button>
      </div>

      {/* Trend */}
      <div style={{ background: "#111", padding: 12, borderRadius: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div>📈 Daily Trend</div>
          <div style={{ display: "flex", gap: 6 }}>
            {['area','line','bar'].map(t => (
              <button key={t} onClick={() => setTrendType(t)} style={{ background: trendType===t ? '#3b82f6' : '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px' }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {['daily','weekly','monthly'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} style={{ background: timeRange===r ? '#10b981' : '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>{r}</button>
          ))}
        </div>

        {trendType === 'area' && (
          <AreaChart width={350} height={250} data={groupedData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
            <CartesianGrid stroke="#222" />
            <Area type="monotone" dataKey="hours" stroke="#bfdbfe" fill="url(#areaGrad)" />
          </AreaChart>
        )}

        {trendType === 'line' && (
          <LineChart width={350} height={250} data={groupedData}>
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
            <CartesianGrid stroke="#222" />
            <Line type="monotone" dataKey="hours" stroke="#c4b5fd" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        )}

        {trendType === 'bar' && (
          <BarChart width={350} height={250} data={groupedData}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#fde68a" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
            <CartesianGrid stroke="#222" />
            <Bar dataKey="hours" fill="url(#barGrad)" radius={[6,6,0,0]} />
          </BarChart>
        )}
      </div>

      {/* Subject Bars */}
      <div style={{ background: "#111", padding: 12, borderRadius: 12 }}>
        <div style={{ marginBottom: 8 }}>📊 Subject Comparison</div>
        <BarChart width={500} height={250} data={subjectData}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="yellowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde68a" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#fde68a" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
          <CartesianGrid stroke="#222" />
          <Bar dataKey="hours" radius={[10,10,0,0]}>
            {subjectData.map((_, i) => {
              const fills = ["url(#blueGrad)", "url(#violetGrad)", "url(#yellowGrad)"];
              return <cell key={i} fill={fills[i % fills.length]} />;
            })}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}