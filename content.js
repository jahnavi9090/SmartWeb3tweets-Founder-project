// Load ethers.js and integrate it for Ethereum blockchain interaction
const { ethers } = window;

let provider;
let signer;

async function initializeEthereum() {
  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    await provider.send('eth_requestAccounts', []);
  } else {
    alert('MetaMask is not installed!');
  }
}

async function getTweetViralityPrediction(tweetID) {
  try {
    const response = await fetch(`https://your-ml-api-url.com/predict?tweet_id=${tweetID}`);
    const result = await response.json();
    return result.predicted_virality;
  } catch (error) {
    console.error('Error fetching virality prediction:', error);
    return null;
  }
}

async function investInTweet(tweetID) {
  await initializeEthereum();

  const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS';
  const abi = [/* Contract ABI */];
  
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const investmentAmount = ethers.utils.parseEther('0.01'); // Example investment

  const prediction = await getTweetViralityPrediction(tweetID);
  if (!prediction) {
    alert('Error predicting tweet virality');
    return;
  }

  try {
    const tx = await contract.investInTweet(tweetID, {
      value: investmentAmount,
    });
    await tx.wait();
    alert('Investment placed successfully!');
  } catch (error) {
    console.error('Error making investment:', error);
  }
}

function createNFTForTweetInvestor(tweetID, investor) {
  // Create an NFT for the investor as a reward for investing in a tweet.
  // NFT minting logic goes here (e.g., using OpenSea SDK or any ERC-721 token standard)
  // ...
}

function injectInvestButtons() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]');
  tweets.forEach(tweet => {
    const tweetID = tweet.getAttribute('data-tweet-id');
    const investButton = document.createElement('button');
    investButton.innerText = "Invest in Tweet";
    investButton.style = "margin-left: 10px; background-color: #1da1f2; color: white; border: none; padding: 5px; cursor: pointer;";
    investButton.onclick = () => investInTweet(tweetID);
    if (!tweet.querySelector('.invest-button')) {
      tweet.appendChild(investButton);
    }
  });
}

// Inject buttons when the page loads
window.onload = injectInvestButtons;
