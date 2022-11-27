/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	let mincost;
	let maxnodes = 40;
	let lvlstep = 1;
	let upgrd = 1;
	let lvl, ram, crs, cch, np;
	let temp2;
	let currentnodes = ns.hacknet.numNodes();
	if (currentnodes == 0) {
		while (ns.getServerMoneyAvailable("home") < ns.hacknet.getPurchaseNodeCost()) {
			await ns.sleep(3000);
		}
		ns.hacknet.purchaseNode();
	}
	let flag = true;
	while (flag) {
		ns.print("=================================================\n=================================================");
		currentnodes = ns.hacknet.numNodes();
		//=================================================================find cheapest option
		lvl = ns.hacknet.getLevelUpgradeCost(0, lvlstep);
		mincost = lvl;
		upgrd = 1;
		for (let j = 0; j < currentnodes; j++) {
			lvl = ns.hacknet.getLevelUpgradeCost(j, lvlstep);
			ram = ns.hacknet.getRamUpgradeCost(j);
			crs = ns.hacknet.getCoreUpgradeCost(j);
			cch = ns.hacknet.getCacheUpgradeCost(j);
			let temp = Math.min(lvl, ram, crs, cch);
			if (temp == lvl && temp < mincost) {
				mincost = temp;
				upgrd = 1;
			} else if (temp == ram && temp < mincost) {
				mincost = temp;
				upgrd = 2;
			} else if (temp == crs && temp < mincost) {
				mincost = temp;
				upgrd = 3;
			} else if (temp == cch && temp < mincost) {
				mincost = temp;
				upgrd = 4;
			}
		}
		np = ns.hacknet.getPurchaseNodeCost();
		if (np < mincost && currentnodes < (maxnodes - 1)) {
			mincost = np;
			upgrd = 5;
		}
		ns.print("Upgrade code:" + upgrd + "    Cost: " + parseInt(mincost) + "\n=================================================");
		//=================================================================buy cheapest option
		if (mincost == Infinity) {
			await ns.sleep(1000);
			ns.print("Fully Upgraded");
			break;
		}
		if (upgrd == 5) {
			while (ns.getServerMoneyAvailable("home") < ns.hacknet.getPurchaseNodeCost()) {
				await ns.sleep(3000);
			}
			ns.hacknet.purchaseNode();
			ns.print("Got new node");
		} else {
			for (let i = 0; i < currentnodes; i++) {
				while (ns.getServerMoneyAvailable("home") < mincost) {
					await ns.sleep(3000);
				}
				if (upgrd == 1) {
					if (ns.hacknet.getLevelUpgradeCost(i, lvlstep) == mincost) {
						temp2 = ns.hacknet.getNodeStats(i).level;
						ns.hacknet.upgradeLevel(i, lvlstep);
						ns.print("Upgraded level of node: " + i + " || from " + temp2 + " to " + ns.hacknet.getNodeStats(i).level + "/200");
					}
				} else if (upgrd == 2) {
					if (ns.hacknet.getRamUpgradeCost(i) == mincost) {
						temp2 = ns.hacknet.getNodeStats(i).ram;
						ns.hacknet.upgradeRam(i);
						ns.print("Upgraded Ram of node: " + i + " || from " + temp2 + " to " + ns.hacknet.getNodeStats(i).ram + "/64");
					}
				} else if (upgrd == 3) {
					if (ns.hacknet.getCoreUpgradeCost(i) == mincost) {
						temp2 = ns.hacknet.getNodeStats(i).cores;
						ns.hacknet.upgradeCore(i);
						ns.print("Upgraded Core of node: " + i + " || from " + temp2 + " to " + ns.hacknet.getNodeStats(i).cores + "/16");
					}
				} else if (upgrd == 4) {
					if (ns.hacknet.getCacheUpgradeCost(i) == mincost) {
						temp2 = ns.hacknet.getNodeStats(i).cache;
						ns.hacknet.upgradeCache(i);
						ns.print("Upgraded Cache of node: " + i + " || from " + temp2 + " to " + ns.hacknet.getNodeStats(i).cache + "/15");
					}
				}
			}
		}
		await ns.sleep(1000);
	}
}
