// Built-in articles drawn from Prof. Nag's published research.
// Shown alongside posts managed in Firestore; `isStatic` marks them as non-editable from the admin UI.

export const featuredBlogs = [
  {
    id: 'designing-timetables-for-large-railways',
    slug: 'designing-timetables-for-large-railways',
    isStatic: true,
    published: true,
    showOnHome: true,
    title: 'Designing Timetables for Large Railways: Where Reliability Meets Resource Constraints',
    excerpt:
      'A timetable is not just a list of departures — it is an optimisation problem that decides how punctual trains are and how much energy, rolling stock and crew a railway consumes.',
    category: 'Transportation',
    date: '2026-10-20',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=700&fit=crop',
    content: `For most passengers, a railway timetable is a printed promise: the train leaves at 07:15 and arrives at 11:40. For the people who run a large railway, it is something far more demanding — a plan that commits tracks, locomotives, coaches, crews and electricity for months in advance, and that must survive the daily reality of delays.

Prof. Bodhibrata Nag's doctoral research at IIM Calcutta, carried out under Prof. Manabendra Nath Pal, addressed exactly this question: how should timetables be designed for a large railway network operating under tight resource constraints? The work was later published as the monograph "Optimal Design of Timetables for Large Railways" (2010).

Why timetabling is hard

On a busy network, every train interacts with every other train it shares track with. A fast express must overtake slower trains at stations with loop lines. Single-line sections allow trains in only one direction at a time. Electric traction draws power that peaks when many trains accelerate together. Locomotives and rakes must be cycled back to where they are needed next, and crews must be relieved within their duty-hour limits.

Change one departure time and the effects ripple across the system. A timetable that looks efficient on paper can collapse under small disturbances, while a very "loose" timetable wastes scarce track capacity.

Optimising for more than one objective

A central idea in Prof. Nag's work is that a timetable should be judged on several dimensions at once. His conference papers from 2004 and 2005 frame the goal as maximising schedule reliability while minimising energy consumption, rolling stock and crew deployment.

Schedule reliability: building in the right amount of slack, at the right places, so that a delay at one station does not cascade across the network.

Energy: arranging departures and running times so that traction power demand is smoother and lower, which matters greatly for an electrified railway.

Rolling stock and crew: designing train paths so that locomotives, coaches and crews can be linked into efficient cycles, reducing the fleet and workforce needed to deliver the same service.

These objectives often pull in opposite directions. Tighter running times use track capacity better but reduce reliability; more slack improves punctuality but may need more rakes to run the same frequency. Operations research gives planners a disciplined way to see these trade-offs and choose among them, rather than relying on incremental, manual adjustments to last year's timetable.

From practice to theory — and back

This research did not begin in a classroom. Before joining IIM Calcutta, Prof. Nag spent nearly two decades in the Indian Railway Service of Electrical Engineers, including as Director at the Research Design & Standards Organisation (RDSO), Lucknow, and as Deputy Chief Electrical Engineer on the South Eastern Railway. That operational exposure shaped a research agenda focused on models that railway managers can actually use.

The same thread runs through his later work: co-authored chapters with Katta G. Murty on the Diesel Locomotive Fueling Problem and on Freight Transport by Rail in "Case Studies in Operations Research" (Springer, 2015), and studies of public procurement and mega-project management in Indian Railways.

Why it matters today

India's railways are adding dedicated freight corridors, semi-high-speed services and near-complete electrification. Each of these raises the stakes for good timetable design. Capacity freed up by a smarter timetable is capacity that does not need to be built, and energy saved at the timetable stage is saved on every run, every day.

The lesson from this research is simple to state and hard to practise: treat the timetable as a system-wide optimisation problem, and make reliability, energy and resources part of the design from the start.`
  },
  {
    id: 'operations-research-of-indian-elections',
    slug: 'operations-research-of-indian-elections',
    isStatic: true,
    published: true,
    showOnHome: true,
    title: 'Organising the World’s Largest Election: An Operations Research Perspective',
    excerpt:
      'Electing 543 members of the Lok Sabha means moving security forces, staff and equipment across a vast country in a carefully sequenced plan. Mathematical optimisation can help design it.',
    category: 'Public Systems',
    date: '2026-10-08',
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&h=700&fit=crop',
    content: `India's general elections are often described as the largest democratic exercise in the world. Behind the headline numbers — hundreds of millions of voters and 543 parliamentary constituencies — sits a logistics problem of remarkable complexity. Polling has to be split into phases, and security forces have to be moved from region to region so that every phase is adequately protected.

Prof. Bodhibrata Nag has studied this problem as an application of operations research. With Katta G. Murty of the University of Michigan, he co-authored "Organizing National Elections in India to Elect the 543 Members of the Lok Sabha" (Algorithmic Operations Research, 2013; also a chapter in "Case Studies in Operations Research", Springer, 2015). He followed this with "A MIP model for scheduling India's General Elections and Police movement" (OPSEARCH, 2014).

The planning problem

An election schedule must answer several linked questions:

Which constituencies should vote in which phase?

How many security personnel does each constituency need, given its size and sensitivity?

How should central police forces be moved between states from one phase to the next, given travel times and the availability of trains and road transport?

How can the whole election be completed in as few phases, and as short a calendar window, as possible?

Each answer constrains the others. Holding more constituencies in a single phase shortens the election but demands more forces at once. Spreading the election out eases the security load but extends the period of campaigning, model-code restrictions and administrative strain.

A mixed-integer programming approach

Mixed-integer programming (MIP) is well suited to this kind of problem. Decisions such as "constituency c votes in phase p" are naturally yes/no variables, while force movements and deployments can be modelled as flows across a network over time. Constraints capture what must hold — every constituency votes exactly once, each phase is adequately secured, forces cannot be in two places at once, and movement takes time.

Solving such a model gives planners a schedule that is feasible by construction and lets them test alternatives: What if a state needs extra security? What if a rail corridor is unavailable? How many additional battalions would allow the election to be completed one phase sooner?

Teaching with real problems

This work also reached the classroom. Harvard Business School published a 2023 case co-authored by Prof. Nag on election planning, giving students around the world the chance to wrestle with the same trade-offs that election authorities face.

The larger lesson

The election study illustrates a theme that runs through Prof. Nag's research: the public sector faces some of the most consequential optimisation problems anywhere, yet they are often solved with experience and spreadsheets alone. Formal models do not replace the judgement of administrators — they give that judgement a clearer view of what is feasible and what each choice costs.

Whether the system is a railway network, a power grid or the machinery of a national election, operations research helps turn a daunting coordination challenge into decisions that can be reasoned about, compared and explained.`
  },
  {
    id: 'green-freight-and-sustainable-ports',
    slug: 'green-freight-and-sustainable-ports',
    isStatic: true,
    published: true,
    showOnHome: true,
    title: 'Greener Freight, Greener Ports: Optimisation for Sustainable Logistics',
    excerpt:
      'From optimising how freight trains are formed to studying India’s journey towards green ports and full rail electrification, analytics can cut emissions without cutting capacity.',
    category: 'Sustainable Supply Chains',
    date: '2026-09-22',
    imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&h=700&fit=crop',
    content: `Freight transport is one of the hardest parts of the economy to decarbonise. Goods must keep moving, volumes keep growing, and much of the infrastructure has a lifespan measured in decades. Prof. Bodhibrata Nag's recent research looks at how operations research and careful case analysis can help logistics systems become greener while staying efficient.

Designing greener freight trains

In "Towards Green Freight Transportation Using Train Design Optimization" (Global Business Review, 2022), Prof. Nag, Samir Maity and Ayan Chatterjee examine how the way freight trains are planned affects their environmental footprint.

Train design covers decisions such as which wagons are grouped into which trains, where trains are formed and broken up, and the routes they take through the network. These choices determine how many train-kilometres are run, how often wagons are shunted in yards, and how full each train is. Better train design means fewer, fuller trains and less shunting — which translates directly into lower energy use and emissions for the same volume of freight.

This is a recurring insight in sustainable supply chain analytics: some of the largest environmental gains come not from new technology alone but from planning existing assets more intelligently.

Ports on the path to sustainability

Ports are where rail, road and sea freight meet, and they are major sources of emissions in their own right. Prof. Nag has co-authored case studies on V.O. Chidambaranar Port Authority in Thoothukudi, including "V.O. Chidambaranar Port Authority's Journey to a Green Port" (2025) and "The Hydrogen Pivot: Orchestrating the Green Transition at V.O. Chidambaranar Port Authority" (2026).

These cases follow how a public-sector port can move from ambition to execution: setting sustainability goals, investing in renewable energy and cleaner equipment, and positioning itself for emerging opportunities such as green hydrogen. They also show the organisational challenges — coordinating stakeholders, financing long-lived assets and managing technological uncertainty.

Electrifying a national railway

A related case, "Strategic Transformation of Indian Railways under the 'Mission 100% Electrification' Initiative" (2026), examines one of the most ambitious decarbonisation programmes in transport anywhere. Electrifying a network of Indian Railways' scale involves sequencing thousands of route-kilometres of work, managing contractors and supply chains, and adapting rolling stock and maintenance practices — all while trains keep running.

For Prof. Nag, who began his career as an electrical engineer in the Central Electricity Authority and Indian Railways, this connects decades of practice with current research on energy and transport systems.

Bringing it into the classroom

These themes feed directly into teaching. Prof. Nag teaches Sustainable Supply Chain Analytics in IIM Calcutta's MBA and MBAEX programmes, and founded the institute's Advanced Program in Supply Chain Management. The courses combine optimisation and simulation methods with real cases, so that future managers learn to quantify the environmental and operational consequences of logistics decisions.

The takeaway

Sustainability in logistics is often framed as a trade-off against cost or capacity. The research suggests a more hopeful view: when trains, ports and networks are designed with analytical care, lower emissions and better operations frequently go together.`
  }
];

export const getFeaturedBlogBySlug = (slug) =>
  featuredBlogs.find((b) => b.slug === slug || b.id === slug) || null;
