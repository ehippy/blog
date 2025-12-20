---
layout: post
title: "Accidently Carbon-Neutral Blog"
categories: [infrastructure, sustainability]
tags: [Infrastructure, Technical Excellence, Technology]
featured_image: gardenKid.jpeg
---

I was a big hippie in college: birks, hacky sack, environmental minor. The whole deal. I've never been able to marry those halcyon days to the week to week technical work I've spent my career doing. Today, waiting on a little technical blocker, I thought about it some and went on a [green-software](https://greensoftware.foundation/) micro-adventure.
<!--more--> 

### The Sustainable Web Manifesto
Firstly, [these folks](https://www.sustainablewebmanifesto.com/) created an outline for how they'd like to see the web stay green, and I can't see too much wrong with it.
- **Clean** – powered by renewable energy  
- **Efficient** – uses the least energy and resources possible  
- **Open** – accessible, standards-based, and universally available  
- **Honest** – transparent about content and intent  
- **Regenerative** – supports a sustainable future through design and intent  
- **Resilient** – functions reliably across conditions, including low-bandwidth environments

I like how **Open** and **Honest** get their place in this conversation. Ecology isn't just plants and soils; all us creatures digging around in both digital and organic dirt must be part of the plan. 

### OK, but can we measure it?
I started searching on how organizations can quantify the environmental impact of their software creations. Quickly, [AWS’s Customer Carbon Footprint Tool](https://aws.amazon.com/blogs/aws/new-customer-carbon-footprint-tool/) appeared as the toy-of-the-day. It provides monthly estimates of emissions based on your AWS usage, broken down by service and region, and includes both “market-based” and “location-based” accounting models. I was tickled to find the folks at AWS had already built this in and turned this on for all their customers. This little site you're reading runs on AWS so I dashed into my account to find that they estimate it burns..... drum roll please..... **0 Estimated Metric Tons of Carbon (MTCO₂e) per month**.


<img src="/images/0emissions.png"
    style="float:right;width:30%;border-radius:20px;box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px; margin-left: 20px;"
    alt="Carbon Neutral!" />
    

My blog is about as simple as it gets: a [static site](https://jamstack.org/what-is-jamstack/) hosted on [Amazon S3](https://aws.amazon.com/s3/), and served through [CloudFront](https://aws.amazon.com/cloudfront/); it costs in the neighborhood of 50 cents/mo to host. There's no server-side logic, no dynamic rendering, and, as you may surmise, very little traffic. 😜

### Make that dial jump
Ok, zero. Is that what it tells everybody? A little birdie took a peek at the same dashboard for an app I used to have a hand in running: a high-traffic, dynamic application with real-time APIs, queues, background workers, and a persistent database footprint. AWS reports its emissions at about **0.2 MTCO₂e/month (market-based)**, or **4.0 MTCO₂e/month (location-based)**. Ok, why's that so different? The first number: Market-Based, accounts for [carbon offsets](https://www.epa.gov/climateleadership/scope-3-inventory-guidance), the second number is the estimated raw carbon production in the locations you're running workloads.

## Is that a lot?
To ground this a bit more: the [average gas-powered commuter in the U.S. emits about 4.6 metric tons of CO₂ per year](https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle). Wait, I thought... am I putting 4 *tons* of gas in my car a year? It turns out *no*, assuming I'm filling up roughly a dozen times a year (yay work from home), I pump ~1.02 metric tons of gasoline into my car. So how does it jump from a ton of gasoline to many tons of CO₂? Burning 1 metric ton of gasoline produces over 3.2 metric tons of CO₂, because each carbon atom bonds with oxygen from the air, more than tripling its weight in the form of [carbon dioxide](https://www.epa.gov/ghgemissions/overview-greenhouse-gases#carbon-dioxide). I had no idea!

![Gasoline gains weight when it's burned!](/images/32carbon.png)

Anyway, that means the complex cloud software system above emits the equivalent of roughly **10 cars** annually, even though its actual server footprint is invisible to most of its users. I guess that feels more efficient to me than I suspected. That business serves millions of people and employs about a hundred with good jobs. Likewise the [carbon trading](https://www.epa.gov/climateleadership/scope-3-inventory-guidance) that AWS is doing shrinks that number 20x.


## Can we make the dial tick back down?
I was surprised by how many of these suggestions from the [Green Software Foundation’s guide](https://greensoftware.foundation/articles/10-recommendations-for-green-software-development) felt foreign to me:

- **Measure what matters** – Track the energy use and carbon emissions of your software and infrastructure. ([Website Carbon Calculator](https://www.websitecarbon.com/), [CO2.js](https://github.com/thegreenwebfoundation/co2.js))
- **Optimize code efficiency** – Reduce unnecessary computation, idle cycles, and processing overhead. ([Web Vitals](https://web.dev/vitals/))
- **Use carbon-aware design** – Time tasks to run when the grid is cleaner (e.g., at night or in renewable-rich regions). ([Carbon-Aware SDK](https://github.com/Green-Software-Foundation/carbon-aware-sdk), [WattTime API](https://www.watttime.org/api-documentation/))
- **Minimize data transfer** – Compress assets, avoid unnecessary network calls, and cache intelligently. ([WebP/AVIF guides](https://web.dev/serve-images-webp/), [CDN optimization](https://developers.cloudflare.com/cache/))
- **Choose efficient hardware** – Prefer modern, energy-efficient chips (e.g., [ARM/Graviton](https://aws.amazon.com/ec2/graviton/)) when deploying workloads.
- **Green your CI/CD** – Avoid redundant builds and tests; shut down idle environments and ephemeral infra.
- **Stay serverless or static when possible** – Use architectures that don’t require always-on compute.
- **Use sustainable regions** – Deploy in cloud regions with better carbon intensity and renewable coverage. ([AWS sustainability](https://sustainability.aboutamazon.com/about/the-cloud), [Google Cloud carbon-free energy](https://cloud.google.com/sustainability/region-carbon))
- **Design for longevity** – Build apps and systems to last — fewer rewrites and migrations mean fewer emissions. ([Sustainable software design](https://principles.green/))
- **Promote transparency and literacy** – Share sustainability practices with your team and community. ([Green Software Foundation](https://greensoftware.foundation/), [Climate Action Tech](https://climateaction.tech/))

So much of the business of software is focused on survival and growth outcomes: revenues, customer sat, deadlines. It's hard to find a place for green engineering. 

But of course it is, the green movement is second-fiddle everywhere. The work of improving the future for those outside our current circle is worth doing, and we can do it from here.

## Integrating these ideas
Looking at this list, I realize my accidentally carbon-neutral blog already hits several of these principles—it's static, efficiently hosted, and built to last. But the bigger revelation is how much room there is to apply these ideas to the systems I work on daily. Carbon-aware scheduling, efficient hardware choices, and measuring what matters aren't just nice-to-haves anymore; they're becoming table stakes for responsible engineering. I don't have to go hop into the greentech space to do this work, and neither do you.