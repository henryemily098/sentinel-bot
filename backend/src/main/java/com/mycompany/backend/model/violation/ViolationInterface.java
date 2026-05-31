package com.mycompany.backend.model.violation;

public interface ViolationInterface {
    public void kickMember();
    public void banMember();
    public  void timeoutMember(int duration);
}
