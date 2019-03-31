package pl.masi.services.interfaces;

import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface IPositionService {
    List<Position> getAll();
    Position createPosition(Position position) throws AppException;
    boolean togglePosition(String name, boolean isActive) throws AppException;

}
