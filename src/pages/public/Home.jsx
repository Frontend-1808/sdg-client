import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import GoalsGrid from "@/components/sections/GoalsGrid";
import { getGoals } from "@/api/goals";

export default function Home() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getGoals()
      .then(setGoals)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero goals={goals} />
      <GoalsGrid goals={goals} loading={loading} error={error} />
    </>
  );
}
