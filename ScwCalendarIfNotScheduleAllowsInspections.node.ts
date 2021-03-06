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
    const allowedDaysPerParty = Math.floor(365/ element.json.dataNew.parties.publicKeys.length);

    let current = 0;
    for (const assigned of element.json.dataNew.calendar.schedule) {
        const next = Number(assigned);
        if (Number.isNaN(next)) {
            current = 0;
        }
        else {
            if (current != 0 && current != next) {
                return true;
            }
            else {
                current = next;
            }
        }
    }

    return false;
}


export class ScwCalendarIfNotScheduleAllowsInspections implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - No Time For Inspections',
		name: 'scwCalendarIfNotScheduleAllowsInspections',
		group: ['transform'],
		version: 1,
        description: 'Input: State Changes - Output: State Changes for which the schedule does not leave enough time for inspections in between reservations.',
		defaults: {
			name: 'No Time For Inspections',
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
