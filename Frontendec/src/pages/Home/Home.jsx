import React from 'react';
import HeroSlider from './HeroSlider';
import MarqueeSection from './MarqueeSection';
import ShopByConcern from './ShopByConcern';
import BestSellers from './BestSellers';
import KidsStore from './KidsStore';
import CategoryShowcase from './CategoryShowcase';
import WinterEssentials from './WinterEssentials';
import ShortReels from './ShortReels';
import PurityBanner from './PurityBanner';
import Testimonials from './Testimonials';
import NewsSection from './NewsSection';
import PledgeSection from './PledgeSection';
import BudgetStore from './BudgetStore';
import MissionSection from './MissionSection';
import FinalCTA from './FinalCTA';

const Home = () => {
    return (
        <div className="space-y-0 overflow-hidden">
            {/* 1. Impact & Branding */}
            <HeroSlider />
            <MarqueeSection />

            {/* 2. Primary Navigation & Sales */}
            <ShopByConcern />
            <BestSellers />

            {/* 3. Targeted Categories */}
            <CategoryShowcase /> {/* Covers Weight, Skin, Hair, Performance */}
            <WinterEssentials />
            <KidsStore />

            {/* 4. Social Proof & Engagement */}
            <ShortReels />
            <Testimonials />

            {/* 5. Trust & Authority */}
            <PurityBanner />
            <NewsSection />

            {/* 6. Values & Deals */}
            <PledgeSection />
            <BudgetStore />
            <MissionSection />

            {/* 7. Footer Sign-off */}
            <FinalCTA />
        </div>
    );
};

export default Home;