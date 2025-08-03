import AccountSetting from '@/assets/images/AccountSetting.svg';
import ChangePassword from '@/components/user/ChangePassword';

const UserPasswordPage: React.FC = () => {
    document.title = 'Account Settings';

    return (
        <div className="flex w-full justify-center">
            <div className="mt-24">
                <img src={AccountSetting} />

                <h1 className="my-8 text-2xl font-medium">
                    Manage your your password to secure account
                </h1>

                <ChangePassword />
            </div>
        </div>
    );
};

export default UserPasswordPage;
