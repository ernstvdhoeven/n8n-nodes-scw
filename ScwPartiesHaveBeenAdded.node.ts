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
    if (element.json.dataNew.parties.publicKeys.length > element.json.dataOld.parties.publicKeys.length)
        return true;

    return false;
}


export class ScwPartiesHaveBeenAdded implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Parties - If Have Been Added',
		name: 'scwPartiesHaveBeenAdded',
		group: ['transform'],
		version: 1,
		description: 'Continues if parties have been added in the current state.',
		defaults: {
			name: 'If Parties Added',
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
