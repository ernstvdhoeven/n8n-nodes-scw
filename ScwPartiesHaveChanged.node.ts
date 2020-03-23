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
    if (element.json.dataNew.parties.publicKeys.length != element.json.dataOld.parties.publicKeys.length)
        return true;

    for (let i = 0; i < element.json.dataNew.parties.publicKeys.length; i++)
        if (element.json.dataNew.parties.publicKeys[i] != element.json.dataOld.parties.publicKeys[i])
            return true;

    return false;
}


export class ScwPartiesHaveChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Parties Changed',
		name: 'scwPartiesHaveChanged',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes in which parties have been changed/added in the new state.',
		defaults: {
            name: 'Parties Changed',
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
