import os
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Train custom YOLO model for BUS-SENSE AI")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image size")
    parser.add_argument("--lr0", type=float, default=0.01, help="Initial learning rate")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Base model architecture (yolov8n, yolov8s, etc.)")
    parser.add_argument("--data", type=str, default="ai/dataset.yaml", help="Path to dataset.yaml")
    parser.add_argument("--project", type=str, default="ai/runs", help="Output project directory")
    parser.add_argument("--name", type=str, default="train_run", help="Output run name")

    args = parser.parse_args()

    # Verify dataset directories exist
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    dataset_path = os.path.join(BASE_DIR, "ai", "dataset")
    
    # Create the folder structure recursively if not exists
    for folder in [
        "images/train", "images/val", "images/test",
        "labels/train", "labels/val", "labels/test"
    ]:
        full_path = os.path.join(dataset_path, folder)
        os.makedirs(full_path, exist_ok=True)
        print(f"Verified directory: {full_path}")

    # Check if we have dataset annotations
    train_images = os.listdir(os.path.join(dataset_path, "images/train"))
    if not train_images:
        print("\n[WARNING] No training images detected in 'ai/dataset/images/train/'.")
        print("Please place custom annotated images (.jpg/.png) and their corresponding YOLO format annotations (.txt) in the training directories first.")
        print("Format per line in .txt: <class_id> <center_x> <center_y> <width> <height>")
        print("Example: 6 0.5 0.5 0.2 0.3 (Accident object in the center)")
        print("\nExiting training script. Place dataset files and run again.")
        sys.exit(1)

    try:
        from ultralytics import YOLO
    except ImportError:
        print("\n[ERROR] 'ultralytics' library is not installed.")
        print("Please activate your virtual environment and run: pip install ultralytics")
        sys.exit(1)

    print(f"Loading base model: {args.model}")
    model = YOLO(args.model)

    print(f"Starting YOLO model training for {args.epochs} epochs...")
    results = model.train(
        data=args.data,
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz,
        lr0=args.lr0,
        project=args.project,
        name=args.name,
        device="cpu"  # Force CPU for standard developer laptop compatibility, can change to '0' for GPU later
    )

    # Save best model to central place
    best_weight = os.path.join(BASE_DIR, args.project, args.name, "weights", "best.pt")
    dest_weight_dir = os.path.join(BASE_DIR, "ai", "models")
    os.makedirs(dest_weight_dir, exist_ok=True)
    dest_weight = os.path.join(dest_weight_dir, "best.pt")

    if os.path.exists(best_weight):
        import shutil
        shutil.copy(best_weight, dest_weight)
        print(f"\n[SUCCESS] Training finished. Copying best weights to: {dest_weight}")
    else:
        print(f"\n[WARNING] Could not locate trained best.pt weights at {best_weight}")

if __name__ == "__main__":
    main()
