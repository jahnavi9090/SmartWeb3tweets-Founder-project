// make sure that ethers.js is available (MetaMask injects it)
const { ethers } = window;

let provider;
let signer;
let contract;
const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS'; // Smart contract address
const abi = [/* Smart contract ABI goes here */];      // Smart contract ABI

// Initialize Ethereum connection via MetaMask
async function initializeEthereum() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await provider.send('eth_requestAccounts', []);
        contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        alert('MetaMask is not installed!');
    }
}

// Connect wallet on button click
document.getElementById('connect-wallet').addEventListener('click', async () => {
    await initializeEthereum();
    alert('Wallet connected!');
    fetchPortfolio(); // Fetch user data after wallet connection
});

// Fetch portfolio data and update the frontend
async function fetchPortfolio() {
    // Example data from smart contract
    const totalInvestments = await contract.getTotalInvestments(); // Get total investments from contract
    const totalProfit = await contract.getTotalProfit();           // Get total profit from contract

    document.getElementById('total-investments').innerText = ethers.utils.formatEther(totalInvestments) + ' ETH';
    document.getElementById('total-profit').innerText = ethers.utils.formatEther(totalProfit) + ' ETH';

    // Fetch and display active bets
    const activeBets = await contract.getActiveBets();
    const activeBetsList = document.getElementById('active-bets');
    activeBetsList.innerHTML = '';

    activeBets.forEach(bet => {
        const li = document.createElement('li');
        li.innerText = `Tweet ID: ${bet.tweetID} | Amount: ${ethers.utils.formatEther(bet.amount)} ETH | Status: ${bet.status}`;
        activeBetsList.appendChild(li);
    });
}

// Handle tweet investment
document.getElementById('invest-in-tweet').addEventListener('click', async () => {
    const tweetID = document.getElementById('tweet-id').value;
    if (!tweetID) {
        alert('Please enter a valid Tweet ID.');
        return;
    }

    // Call the smart contract to invest in the tweet
    try {
        const tx = await contract.investInTweet(tweetID, {
            value: ethers.utils.parseEther('0.01') // Example: investing 0.01 ETH
        });
        await tx.wait();
        alert('Investment placed successfully!');
        fetchPortfolio(); // Update portfolio after investment
    } catch (error) {
        console.error('Error making investment:', error);
        alert('Failed to invest in the tweet.');
    }
});

// Fetch virality prediction from backend API and display chart
async function fetchViralityPrediction(tweetID) {
    try {
        const response = await fetch(`https://your-ml-api-url.com/predict?tweet_id=${tweetID}`);
        const data = await response.json();

        // Display virality prediction on chart
        const ctx = document.getElementById('virality-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Time', 'Likes', 'Retweets', 'Shares'],
                datasets: [{
                    label: 'Virality Prediction',
                    data: [10, 50, 100, data.predicted_virality], // Example data
                    backgroundColor: 'rgba(29, 161, 242, 0.2)',
                    borderColor: 'rgba(29, 161, 242, 1)',
                    borderWidth: 2
                }]
            }
        });
    } catch (error) {
        console.error('Error fetching virality prediction:', error);
    }
}

// Fetch initial portfolio and prediction data
fetchPortfolio();
fetchViralityPrediction('12345');  // Default tweetID for testing
