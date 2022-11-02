/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	let mincost;
	let maxnodes=30;
	let upgrd=1;
	let a,b,c,d;
	let temp2;
	let currentnodes=ns.hacknet.numNodes();
	if(currentnodes==0){
		while(ns.getServerMoneyAvailable("home")<ns.hacknet.getPurchaseNodeCost()){
			await ns.sleep(3000);
		}
		ns.hacknet.purchaseNode();
	}
	let flag=true;
	while(flag){
		ns.print("=================================================\n=================================================");
		currentnodes=ns.hacknet.numNodes();
		//=================================================================find cheapest option
		a=ns.hacknet.getLevelUpgradeCost(0,10);
		mincost=a;
		upgrd=1;
		for(let j=0;j<currentnodes;j++){
			a=ns.hacknet.getLevelUpgradeCost(j,10);
			b=ns.hacknet.getRamUpgradeCost(j);
			c=ns.hacknet.getCoreUpgradeCost(j);
			let temp=Math.min(a,b,c);
			if(temp==a && temp<mincost) {
				mincost=temp;
				upgrd=1;
			}else if(temp==b && temp<mincost){
				mincost=temp;
				upgrd=2;
			}else if(temp==c && temp<mincost){
				mincost=temp;
				upgrd=3;
			}
		}
		d=ns.hacknet.getPurchaseNodeCost();
		if(d<mincost && currentnodes<(maxnodes-1)){
			mincost=d;
			upgrd=4;
		}
		ns.print("Upgrade code:"+upgrd+"    Cost: "+mincost+"\n=================================================");
		//=================================================================buy cheapest option
		if(mincost==Infinity){
			await ns.sleep(1000);
			ns.print("Fully Upgraded");
			break;
		}
		if(upgrd==4){
				while(ns.getServerMoneyAvailable("home")<ns.hacknet.getPurchaseNodeCost()){
					await ns.sleep(3000);
				}
				ns.hacknet.purchaseNode();
				ns.print("Got new node");
		}else{
			for(let i=0;i<currentnodes;i++){
				while(ns.getServerMoneyAvailable("home")<mincost){
					await ns.sleep(3000);
				}
				if(upgrd==1){
					if(ns.hacknet.getLevelUpgradeCost(i,10)==mincost){
						temp2=ns.hacknet.getNodeStats(i).level;
						ns.hacknet.upgradeLevel(i,10);
						ns.print("Upgraded level of node: "+i+"/"+(currentnodes-1)+" || from "+temp2+" to "+ns.hacknet.getNodeStats(i).level);
					}
				}else if(upgrd==2){
					if(ns.hacknet.getRamUpgradeCost(i)==mincost){
						temp2=ns.hacknet.getNodeStats(i).ram;
						ns.hacknet.upgradeRam(i);
						ns.print("Upgraded Ram of node: "+i+"/"+(currentnodes-1)+" || from "+temp2+" to "+ns.hacknet.getNodeStats(i).ram);
					}
				}else if(upgrd==3){
					if(ns.hacknet.getCoreUpgradeCost(i)==mincost){
						temp2=ns.hacknet.getNodeStats(i).cores;
						ns.hacknet.upgradeCore(i);
						ns.print("Upgraded Core of node: "+i+"/"+(currentnodes-1)+" || from "+temp2+" to "+ns.hacknet.getNodeStats(i).cores);
					}
				}
			}
		}
		await ns.sleep(1000);
	}
}
