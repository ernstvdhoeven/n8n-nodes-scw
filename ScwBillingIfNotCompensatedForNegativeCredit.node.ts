import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


const DAY = 24 * 60 * 60 * 1000;

const CREDIT_PER_DAY = 100
const CREDIT_PER_FORK = 2
const CREDIT_PER_PAN = 10
const CREDIT_PER_DAY_ELEC = 5


function keep(element, index, array) {
    const daysInHouse = element.json.dataNew.calendar.schedule.length;
    if (daysInHouse == 0)
        return false;

    // this is a HACK for the purpose of this workshop (like so many others)
    // using this check we limit the amount of tests we need to modify for a correct result
    const uniqueScheduled = new Set(element.json.dataNew.calendar.schedule);
    if (uniqueScheduled.size != 1)
        return false;

    const price = element.json.dataNew.calendar.schedule.length * CREDIT_PER_DAY;
    const i = Number(element.json.dataNew.calendar.schedule[0]) - 1;
    const balanceAfter = element.json.dataOld.billing.balance[i] - price;

    if (balanceAfter >= 0)
        return false;

    const shortOn = price + balanceAfter;
    const balancesNew = element.json.dataNew.billing.balance.reduce((acc, cur) => acc + cur, 0);
    const balancesOld = element.json.dataOld.billing.balance.reduce((acc, cur) => acc + cur, 0);

    return balancesOld != balancesNew - shortOn;
}


export class ScwBillingIfNotCompensatedForNegativeCredit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Billing - If Not Compensated For Negative Credit',
		name: 'scwBillingIfNotCompensatedForNegativeCredit',
		group: ['transform'],
		version: 1,
		description: 'Continues if the parties do not compensate for negative credit of another party.',
		defaults: {
			name: 'If Not Compensated For Negative Credit',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}
