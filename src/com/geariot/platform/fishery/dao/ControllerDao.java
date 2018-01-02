package com.geariot.platform.fishery.dao;

import java.util.List;

import com.geariot.platform.fishery.entities.AIO;
import com.geariot.platform.fishery.entities.Controller;
import com.geariot.platform.fishery.entities.Sensor;
import com.geariot.platform.fishery.model.Equipment;

public interface ControllerDao {

	void save(Controller controller);

	int delete(int controllerId);
	
	int delete(String deviceSns);

	Controller findControllerById(int controllerId);
	
	Controller findControllerByDeviceSns(String deviceSns);

	List<Controller> queryControllerByNameAndRelation(String relation, String name, int from, int pageSize);

	long queryControllerByNameAndRelationCount(String relation, String name);

}