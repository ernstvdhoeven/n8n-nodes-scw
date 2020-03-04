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
    const afterCleanup = element.json.dataNew.parties.publicKeys.map(x => x.charAt(0));
    return afterCleanup.length != Array.from(new Set(afterCleanup)).length;
}


export class ScwPartiesIfNotDistinctAfterCleanup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Parties - If Not Unique After Cleanup',
		name: 'scwPartiesIfNotDistinctAfterCleanup',
		group: ['transform'],
		version: 1,
		description: 'Continues if there are double entries in the list of parties (after proper key formatting) in the current state.',
		defaults: {
			name: 'If Not Unique After Cleanup',
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
