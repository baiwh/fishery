package com.geariot.platform.fishery.dao;

import java.util.List;

import com.geariot.platform.fishery.entities.Timer;



public interface TimerDao {
    void save(Timer timer);
	
	void delete(String device_sn);

	Timer findTimerById(int timerId);
	
	Timer findTimerByDeviceSns(String device_sn);

	List<Timer> queryTimerByDeviceSn(String device_sn, int from, int pageSize);

	void updateTimer(Timer timer);
}