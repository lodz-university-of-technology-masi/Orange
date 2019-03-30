package pl.masi.services.interfaces;

import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;

public interface IPositionService {
    Position createPosition(Position position) throws AppException;
    boolean togglePosition(String name, boolean isActive) throws AppException;

}
