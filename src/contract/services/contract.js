import Contract from "../models/contract.js";
import Op from "sequelize";
import User from "../../users/services/user.js";
import userService from "../../users/services/user.js";
import { createChannel, createUser } from "../../jobs/sendbird.js";
const contractService = {
    startChat: async (contractorId,providerId) => {
        const contract = await Contract.create({ providerId, contractorId });
        const contractor = await userService.fetchme(contractorId);
        const provider = await userService.fetchme(providerId);
        

        await createUser(contractor.id, contractor.username);
        await createUser(provider.id, provider.username);
        
        const channel = await createChannel(contractor.id, provider.id);
        
        await contract.update({ chat: channel.url });
        return contract
    },
    getContract: async (contractId) => {
        const contract = await Contract.findByPk(contractId, {
            include: [
                { model: User, as: 'Contractor' },
                { model: User, as: 'Provider' },
                { model: Service, as: 'Service' }
            ]
        });
        if (!contract) throw new Error('Contract not found');
        return contract;
    },
    contractorAccept: async (contractorId,providerId) => {

        const hasOtherContract = await Contract.findOne({
            where: {
                [Op.and]:[
                    { contractorId: contractorId },
                    { isEnabled: true },
                ]
            }
        });

        if (hasOtherContract) throw new Error('You already have an active contract');
        const contract = await Contract.update({
            contractorAccepted: true,
            where: {
                [Op.and]: [
                    { contractorId: contractorId },
                    { providerId: providerId },
                ]
            }
        })
        return contract
    },
    providerAccept: async (providerId, contractId) => {
        const contract = await contractService.getContract(contractId);
        if(contract.ContractorAccepted === false) throw new Error('Contractor must accept the contract first');
        return await contract.update({
            providerId: providerId,
            ProviderAccepted: true,
            isEnabled: true
        });
    },



    contractorDone: async (contractId,rating) => {
        const contract = await contractService.getContract(contractId);
        if (contract.ContractorDone) throw new Error('Contractor has already marked the service as done');
        await contract.update({ ContractorDone: true });
        await contractService.rateUser(contract.providerId, rating); 
        contract.update({ isEnabled: false });
    },
    providerDone: async (contractId,rating) => {
        const contract = await contractService.getContract(contractId);
        if (contract.ContractorDone) throw new Error('Contractor must mark the service as done first');
        await contract.update({ ProviderDone: true });
        await contractService.rateUser(contract.contractorId, rating);
    },
    rateUser: async (userId, rating) => {
        const user = await userService.fetchme(userId);
        const newRating = (user.rating + rating) / (user.numberOfRatings + 1);
        return await user.update({ rating: newRating });
    }
}