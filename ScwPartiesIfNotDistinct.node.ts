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
		displayName: 'Scw - Double Parties',
		name: 'scwPartiesIfNotDistinct',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which there are double entries in the list of parties in the new state.',
		defaults: {
			name: 'Double Parties',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}
