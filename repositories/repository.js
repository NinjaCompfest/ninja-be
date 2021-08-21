const User = require("../models/users");
const Program = require("../models/programs");
const Notification = require("../models/notifications");

class Repository {
    constructor() {}

    async addUserAndRole(registerRequestDTO) {
        const existingUsers = await User.find({
            username: registerRequestDTO["username"],
        }).exec();
        if (existingUsers.length === 0) {
            const newUser = await User.create(registerRequestDTO);
            return { ...newUser }._doc;
        } else {
            console.error(
                `ERROR when creating user. user with username: "${registerRequestDTO["username"]}" already exist!`
            );
            return undefined;
        }
    }

    async getUserByUsername(username) {
        const results = await User.find({ username }).exec();
        if (results.length === 0) {
            return undefined;
        }
        return results[0];
    }

    async getPastDonations(id) {
        const pastDonations = await Program.aggregate([
            { $unwind: "$donators" },
            { $match: { "donators.donator_id": id } },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    donated_amount: "$donators.donated_amount",
                },
            },
        ]);

        if (pastDonations.length === 0) {
            return undefined;
        }
        return pastDonations;
    }

    async getProgramByFundraiserId(fundraiserId) {
        const myPrograms = await Program.find({
            fundraiser_id: fundraiserId,
            isVerified: true,
        }).exec();
        if (myPrograms.length === 0) {
            return undefined;
        }
        return myPrograms;
    }

    async getVerifiedPrograms() {
        const results = await Program.find({ isVerified: true })
            .select({ title: 1, collected_amount: 1 })
            .exec();
        if (results.length === 0) {
            return undefined;
        }
        return results;
    }

    async getProgramById(id) {
        const result = await Program.findById(id).exec();
        if (result === null) {
            return undefined;
        }
        return result;
    }

    async withdrawById(userId, programId, amount) {
        const program = await Program.findOne({ _id: programId }).exec();

        const notification = await Notification.create({
            type: "WITHDRAWAL",
            type_id: userId,
            program_id: programId,
            amount: amount,
            program_name: program.title,
        });

        return notification;
    }

    async topupById(userId, amount) {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: amount } },
            { new: true }
        ).exec();
        if (user === null) {
            return undefined;
        }
        return user;
    }

    async addProgram(title, description, id) {
        const newProgram = new Program({
            title,
            description,
            collected_amount: 0,
            fundraiser_id: id,
            isVerified: false,
        });
        await newProgram.save();
        return newProgram;
    }

    // TODO change to use transaction
    async donorProgram(userId, programId, amount) {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: -amount } },
            { new: true }
        ).exec();

        const newDonator = {
            donator_id: userId,
            date: new Date(),
            donated_amount: amount,
        };
        await Program.findOneAndUpdate(
            { _id: programId },
            {
                $push: { donators: newDonator },
                $inc: { collected_amount: amount },
            }
        ).exec();

        return user;
    }

    async addNotification(notifDTO) {
        const newNotification = await Notification.create(notifDTO);
        if (newNotification === null || newNotification === undefined) {
            return undefined;
        }
        return newNotification;
    }

    async getAllNotifications() {
        const notifications = await Notification.find({}).exec();
        if (notifications.length === 0) {
            return undefined;
        }
        return notifications;
    }

    async respondWithdrawal(notifId) {
        const notif = await Notification.findById(notifId).exec();
        if (notif === null || notif === undefined) {
            return undefined;
        }
        const user = await User.findOneAndUpdate(
            { _id: notif.type_id },
            { $inc: { balance: notif.amount } },
            { new: true }
        ).exec();
        if (user === null || user === undefined) {
            return undefined;
        }
        const program = await Program.findOneAndUpdate(
            { _id: notif.program_id },
            { $inc: { collected_amount: -notif.amount } },
            { new: true }
        ).exec();

        if (program === null || program === undefined) {
            return undefined;
        }
        return program;
    }

    async respondFundraise(notifId) {
        const notification = await Notification.findById(notifId);
        if (notification === null || notification === undefined) {
            return undefined;
        }
        const userId = notification.type_id;
        if (userId === null || userId === undefined) {
            return undefined;
        }
        const verifiedUser = await User.findOneAndUpdate(
            { _id: userId },
            { isVerified: true },
            { new: true }
        );
        console.log("verified",verifiedUser)

        if (verifiedUser === null || verifiedUser === undefined) {
            return undefined;
        }
        return verifiedUser;
    }

    async respondProgram(notifId) {
        const notification = await Notification.findById(notifId);
        if (notification === null || notification === undefined) {
            return undefined;
        }
        const programId = notification.type_id;
        if (programId === null || programId === undefined) {
            return undefined;
        }
        const verifiedProgram = await Program.findOneAndUpdate(
            { _id: programId },
            { isVerified: true },
            { new: true }
        );
        if (verifiedProgram === null || verifiedProgram === undefined) {
            return undefined;
        }
        return verifiedProgram;
    }

    async deleteNotificationById(notifId) {
        console.log("notifId", notifId);
        const notification = await Notification.findOneAndDelete({
            _id: notifId,
        });
        if (notification === null) {
            return undefined;
        }
        return notification;
    }
}

module.exports = {
    Repository,
};
