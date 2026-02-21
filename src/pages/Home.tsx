import GlobalHeader from "@/components/GlobalHeader";
import DashboardViews from "@/components/DashboardViews";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <DashboardViews />
    </div>
  );
};

export default Home;
