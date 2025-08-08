import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import User from "../../users/models/user.js";
import Service from "../../services/models/services.js";

const Contract = sequelize.define('Contract', {
    contractorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'id'
        }
    },
    ContractorAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ProviderAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ContractorDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ProviderDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    chat: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});


Contract.belongsTo(User, { as: 'Contractor', foreignKey: 'contractorId', onDelete: 'CASCADE' });
Contract.belongsTo(User, { as: 'Provider', foreignKey: 'providerId', onDelete: 'CASCADE' });
Contract.belongsTo(Service, { as: 'Service', foreignKey: 'serviceId', onDelete: 'CASCADE' });

User.hasMany(Contract, { as: 'ContractsAsContractor', foreignKey: 'contractorId' });
User.hasMany(Contract, { as: 'ContractsAsProvider', foreignKey: 'providerId' });
Service.hasMany(Contract, { foreignKey: 'serviceId' });

export default Contract;