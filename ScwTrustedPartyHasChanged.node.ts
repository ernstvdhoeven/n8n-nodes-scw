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
    if (element.json.dataNew.trustedParty.publicKey != element.json.dataOld.trustedParty.publicKey)
        return true;

    return false;
}


export class ScwTrustedPartyHasChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Trusted Party Changed',
		name: 'scwTrustedPartyHasChanged',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the trusted party of the contract has changed.',
		defaults: {
			name: 'Trusted Party Changed',
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
