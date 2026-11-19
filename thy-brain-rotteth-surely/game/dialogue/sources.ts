export const SOURCES = {
    apa: {
        name: 'American Psychological Association',
        citation: 'American Psychological Association. “Mental Health Issues Increased Significantly in Young Adults Over Last Decade.” 14 Mar. 2019.',
        url: 'https://www.apa.org/news/press/releases/2019/03/mental-health-adults',
        study: 'https://www.apa.org/pubs/journals/features/abn-abn0000410.pdf',
        note: 'The release summarizes U.S. survey research by Twenge and colleagues. Reported major depressive episodes rose among adolescents ages 12–17 from 2005 to 2017 and among young adults ages 18–25 from 2009 to 2017. The surveys tracked trends. The role of digital media remained a hypothesis.',
    },
    cdc: {
        name: 'CDC high school sleep trends',
        citation: 'Centers for Disease Control and Prevention. “Data Summary & Trends Report for Dietary, Physical Activity, and Sleep Behaviors.” CDC, 14 Jan. 2025.',
        url: 'https://www.cdc.gov/yrbs/dstr/dietary-physical-sleep-behaviors.html',
        note: 'The share of U.S. high school students reporting at least eight hours of sleep on an average school night declined from 2013 to 2023. The report describes a trend and leaves the cause open.',
    },
    diamond: {
        name: 'Diamond',
        citation: 'Diamond, Adele. “Executive Functions.” Annual Review of Psychology, vol. 64, 2013, pp. 135–168.',
        url: 'https://doi.org/10.1146/annurev-psych-113011-143750',
        note: 'On p. 153, this review describes how executive functions can suffer with stress, sadness, loneliness, sleep deprivation, and poor physical fitness. In-game abilities and their numerical effects are fictional.',
    },
    ford: {
        name: 'Ford et al.',
        citation: 'Ford, Earl S., Timothy J. Cunningham, and Janet B. Croft. “Trends in Self-Reported Sleep Duration among US Adults from 1985 to 2012.” Sleep, vol. 38, no. 5, 2015, pp. 829–832.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25669182/',
        note: 'The share of U.S. adults reporting six hours of sleep or less rose from 22.3% in 1985 to 29.2% in 2012. The study measured reported sleep duration and leaves the contribution of social media open.',
    },
    fryar: {
        name: 'Fryar et al.',
        citation: 'Fryar, Cheryl D., et al. “Prevalence of Overweight, Obesity, and Severe Obesity Among Adults Age 20 and Older: United States, 1960–1962 Through August 2021–August 2023.” NCHS Health E-Stat, no. 111, Feb. 2026, pp. 1–7.',
        url: 'https://stacks.cdc.gov/view/cdc/174643',
        note: 'This report supplies historical context on adult obesity prevalence. It uses body mass index and covers a different population and outcome from the youth cardiorespiratory fitness survey.',
    },
    gahche: {
        name: 'Gahche et al.',
        citation: 'Gahche, Jaime, et al. “Cardiorespiratory Fitness Levels among U.S. Youth Aged 12–15 Years: United States, 1999–2004 and 2012.” NCHS Data Brief, no. 153, May 2014.',
        url: 'https://www.cdc.gov/nchs/products/databriefs/db153.htm',
        note: 'The share of U.S. youth ages 12–15 meeting the report’s cardiorespiratory fitness benchmark fell from 52.4% in 1999–2000 to 42.2% in 2012. The surveys leave the reason for that change open.',
    },
    dictionary: {
        name: 'Merriam-Webster',
        citation: 'Merriam-Webster. “Executive Function.” Merriam-Webster.com Dictionary. Accessed 22 Oct. 2026.',
        url: 'https://www.merriam-webster.com/dictionary/executive%20function',
        note: 'Executive function covers processes such as working memory, impulse inhibition, and reasoning that help us pursue goals. Remembering a plan and deciding when to spend Focus illustrate the term.',
    },
    neves: {
        name: 'Neves and Neves',
        citation: 'Neves, Henrique de Castro, and Keli Cristina de Lima Neves. “Has the Flynn Effect Reversed? Environmental Cognitive Restructuring and the Academic Performance of Generation Z.” The International Journal of Business Management and Technology, vol. 10, no. 2, Feb. 2026, pp. 35–48.',
        url: 'https://doi.org/10.5281/zenodo.18830033',
        note: 'This theoretical synthesis discusses declines on international academic assessments across several OECD countries. The authors describe evidence for widespread biological decline as inconclusive.',
    },
    teasdale: {
        name: 'Teasdale and Owen',
        citation: 'Teasdale, Thomas W., and David R. Owen. “Forty-Year Secular Trends in Cognitive Abilities.” Intelligence, vol. 28, no. 2, 2000, pp. 115–120.',
        url: 'https://www.sciencedirect.com/science/article/abs/pii/S0160289699000343',
        note: 'Cognitive test scores among Danish conscripts showed modest gains between 1988 and 1998. The sample, dates, and tests differ from the international school assessments discussed by Neves and Neves.',
    },
    yousef: {
        name: 'Yousef et al.',
        citation: 'Yousef, Ahmed M., et al. “Demystifying the New Dilemma of Brain Rot in the Digital Era: A Review.” Brain Sciences, vol. 15, no. 3, 2025, article 283.',
        url: 'https://doi.org/10.3390/brainsci15030283',
        note: 'The review discusses the popular term for supposed mental deterioration associated with consuming trivial material. Wood uses the term more loosely for entertainment that asks very little of the viewer.',
    },
};

export type SourceId = keyof typeof SOURCES;
export const SOURCE_IDS = Object.keys(SOURCES) as SourceId[];
export const sourceNumber = (id: SourceId): number => SOURCE_IDS.indexOf(id) + 1;
