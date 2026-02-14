import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Leaf className="w-8 h-8 text-primary" />
          <span className="text-2xl font-display font-bold text-foreground">WildGuard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Welcome Home
        </h1>
        <p className="text-muted-foreground text-lg font-body mb-8">
          You're now part of the movement. This is where your journey begins.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:text-primary/80 font-body underline underline-offset-4 transition-colors"
        >
          ← Back to landing
        </button>
      </div>
    </div>
  );
};

export default Home;
