#include<iostream>
using namespace std;

class BankAccount {
protected: double balance;
public:
    BankAccount(double b): balance(b){}
    void deposit(double a){ balance+=a; }
    virtual bool withdraw(double a){
        if(a>balance) return false;
        balance-=a; return true;
    }
    double getBalance(){ return balance; }
};

class SavingsAccount: public BankAccount {
    double minimumBalance;
public:
    SavingsAccount(double b, double m): BankAccount(b), minimumBalance(m){}
    bool withdraw(double a) override {
        if(balance-a < minimumBalance) return false;
        balance-=a; return true;
    }
};

int main(){
    SavingsAccount sa(1000, 200);
    cout << (sa.withdraw(850) ? "OK" : "TU CHOI") << "\n";
    cout << (sa.withdraw(700) ? "OK" : "TU CHOI") << "\n";
    cout << "Balance: " << sa.getBalance() << "\n";
}
