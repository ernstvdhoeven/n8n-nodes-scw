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
    if (element.json.dataNew.signatures.signatures.length != element.json.dataOld.signatures.signatures.length)
        return true;

    for (let i = 0; i < element.json.dataNew.signatures.signatures.length; i++)
        if (element.json.dataNew.signatures.signatures[i] != element.json.dataOld.signatures.signatures[i])
            return true;

    return false;
}


export class ScwSignaturesIfSignaturesChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Signatures Changed',
		name: 'scwSignaturesIfSignaturesChanged',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the number of signatures has changed between the old and new state.',
		defaults: {
			name: 'Signatures Changed',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}
