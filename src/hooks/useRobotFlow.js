/**
 * useRobotFlow 
 * Orchestrates the sequence of features/nodes to visit.
 * Defines the script for each molecular feature.
 */
export const TOUR_FLOW = [
    {
        section: 'hero',
        nodes: [
            { id: 'hero-title', text: "Welcome to the evolution of the internet. I am your immersive guide.", duration: 4000 },
        ]
    },
    {
        section: 'arpanet',
        nodes: [
            { id: 'arpanet-main', text: "Here is the ARPANET core. It was the first time computers truly spoke to each other.", duration: 5000, action: 'hover' },
            { id: 'arpanet-node-1', text: "Nodes like UCLA and SRI formed the first backbone in 1969.", duration: 4000, action: 'highlight' },
        ]
    },
    {
        section: 'dotcom',
        nodes: [
            { id: 'dotcom-title', text: "The 90s brought the Web to the masses. A wild, experimental explosion of color.", duration: 5000 },
            { id: 'dotcom-card-0', text: "Search engines like Yahoo and Google began organizing the world's knowledge.", duration: 5000, action: 'click' },
            { id: 'dotcom-card-1', text: "E-commerce started with Amazon and eBay, changing how we trade forever.", duration: 5000, action: 'hover' },
        ]
    },
    {
        section: 'social',
        nodes: [
            { id: 'social-title', text: "The Social Era turned the internet into a mirror of our lives.", duration: 5000 },
            { id: 'social-phone', text: "The iPhone in 2007 put the entire web in our pockets. 24/7 connectivity.", duration: 6000, action: 'highlight' },
            { id: 'social-year-2012', text: "By 2012, mobile traffic officially surpassed desktop.", duration: 4000, action: 'click' },
        ]
    },
    {
        section: 'web3',
        nodes: [
            { id: 'web3-center', text: "We are now moving toward a decentralized, user-owned internet.", duration: 5000, action: 'hover' },
            { id: 'web3-node-0', text: "Blockchain and smart contracts remove the need for central middlemen.", duration: 5000, action: 'highlight' },
        ]
    },
    {
        section: 'airevolution',
        nodes: [
            { id: 'ai-title', text: "The AI Revolution. The network has begun to think and create.", duration: 5000 },
            { id: 'ai-brain-svg', text: "Cognitive modules now reason across billions of parameters in real-time.", duration: 6000, action: 'hover' },
        ]
    },
    {
        section: 'spatial',
        nodes: [
            { id: 'spatial-layer-1', text: "Finally, the Spatial Web. Reality itself is becoming an interactive layer.", duration: 5000, action: 'highlight' },
            { id: 'spatial-card-1', text: "Digital twins and AR meshes merge the physical and digital worlds.", duration: 6000, action: 'click' },
            { id: 'spatial-title', text: "The future is immersive. Thank you for taking this journey with me.", duration: 8000 },
        ]
    }
]

export function useRobotFlow() {
    return { TOUR_FLOW }
}
