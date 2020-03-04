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
    return element.json.dataNew.parties.publicKeys.length != Array.from(new Set(element.json.dataNew.parties.publicKeys)).length;
}


export class ScwPartiesIfNotDistinct implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Parties - If Not Unique',
		name: 'scwPartiesIfNotDistinct',
		group: ['transform'],
		version: 1,
		description: 'Continues if there are double entries in the list of parties in the current state.',
		defaults: {
			name: 'If Not Unique',
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
