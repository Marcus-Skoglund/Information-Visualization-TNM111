import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
import math
import os

class ScatterPlot:
    def __init__(self, root):
        self.root = root
        self.root.title("TNM111 Assignment 2: Scatter plot Visualization")
        
        # Canvas dimensions
        self.width = 1100
        self.height = 800
        self.pad = 80

        # Instruction label at the top
        self.instr_label = tk.Label(
        root, 
        text="Select dataset in the lower left corner \n Left-Click a point to set Origin | Right-Click for 5-Nearest Neighbors",
        font=("Arial", 14, "italic"),
        fg="#555555", # Dark grey for a professional look
        pady=5
        )
        self.instr_label.pack(side=tk.TOP)

        # Data and Interaction State
        self.df = None
        self.origin_idx = None
        self.neighbor_idx = None
        self.shape_map = {} # Maps category strings to shape types

        # UI Setup
        self.canvas = tk.Canvas(root, width=self.width, height=self.height, bg="white")
        self.canvas.pack(pady=10)

        # Radiobuttons
        self.selection_var = tk.StringVar(value="none") # Variable to manage the selection
        self.btn_frame = tk.Frame(root)
        self.btn_frame.pack(fill=tk.X, padx=20, pady=5)
        
        tk.Radiobutton(self.btn_frame, text=" Data1 ", variable=self.selection_var, value="data1", command=lambda: self.load_csv("data1.csv"), font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=10)
        tk.Radiobutton(self.btn_frame, text=" Data2 ", variable=self.selection_var, value="data2", command=lambda: self.load_csv("data2.csv"), font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=10)
        self.status = tk.Label(self.btn_frame)

        # Mouse Bindings
        self.canvas.bind("<Button-1>", self.on_left_click)   # Left Click: New Origin
        self.canvas.bind("<Button-3>", self.on_right_click)  # Right Click: 5 Neighbors

    def load_csv(self, filename):
        # Set default directory
        initial_dir = r"D:\Skola\TNM111 (InfoVis)\Assignment2" # <------------- FOR OTHERS: UPDATE THIS PATH TO WHAT YOU HAVE
        full_path = os.path.join(initial_dir, filename)
            
        if os.path.exists(full_path):
            try:
                # header=None because data1/data2 are headerless
                self.df = pd.read_csv(full_path, header=None)
                self.origin_idx = None # reset origin
                self.neighbor_idx = None # reset KNN
                    
                # Dynamic shape mapping for the 3rd column
                categories = self.df[2].unique()
                shapes = ['circle', 'square', 'triangle']
                self.shape_map = {cat: shapes[i % len(shapes)] for i, cat in enumerate(categories)} # automatically loops through last column and assigns a shape
                    
                self.redraw()
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load {filename}: {e}")
        else: 
            messagebox.showerror("Error", f"Could not find file: {full_path}")

    def get_pixel_coords(self, val_x, val_y): # Converts raw data points to pixels on the screen.
        x_min, x_max = self.df[0].min(), self.df[0].max()
        y_min, y_max = self.df[1].min(), self.df[1].max()
        
        x_range = (x_max - x_min) if x_max != x_min else 1
        y_range = (y_max - y_min) if y_max != y_min else 1
        
        px = self.pad + (val_x - x_min) / x_range * (self.width - 3 * self.pad) # width of x-axis
        # Flip Y (Tkinter starts at the top left)
        py = (self.height - self.pad) - (val_y - y_min) / y_range * (self.height - 2 * self.pad) # width of y-axis
        return px, py

    def draw_shape(self, px, py, shape_type, color, outline="black", width=1):
        s = 6 # radius
        if shape_type == 'circle':
            self.canvas.create_oval(px-s, py-s, px+s, py+s, fill=color, outline=outline, width=width)
        elif shape_type == 'square':
            self.canvas.create_rectangle(px-s, py-s, px+s, py+s, fill=color, outline=outline, width=width)
        elif shape_type == 'triangle':
            self.canvas.create_polygon(px, py-s, px-s, py+s, px+s, py+s, fill=color, outline=outline, width=width)

    def draw_legend(self):        # Legend Box
        self.canvas.create_line(self.width-150, 30, self.width-50, 30, fill="black", width=2) # (x1, y1, x2, y2)
        self.canvas.create_text(self.width-100, 40, text="CATEGORIES", font=("Arial", 9, "bold"))
        for i, (cat, shape) in enumerate(self.shape_map.items()):
            ly = 65 + (i * 25)
            self.draw_shape(self.width-120, ly, shape, "#bdc3c7")
            self.canvas.create_text(self.width-90, ly, text=cat, anchor="w", font=("Arial", 9))

        # Calculate how many items are in the legend
        num_items = len(self.shape_map)
        bottom_line = 60 + (num_items * 25)
        side_lines = 85 + (i * 25)
        self.canvas.create_line(self.width-150, 30, self.width-150, side_lines, fill="black", width=2) # (x1, y1, x2, y2)
        self.canvas.create_line(self.width-50, 30, self.width-50, side_lines, fill="black", width=2) # (x1, y1, x2, y2)
        self.canvas.create_line(self.width-150, bottom_line, self.width-50, bottom_line, fill="black", width=2) # (x1, y1, x2, y2)

    def on_left_click(self, event):
        idx = self.find_clicked(event) # looks at coordinates clicked and checks if there is a data point there
        if idx == self.origin_idx:
            self.origin_idx = None
        else:
            self.origin_idx = idx
        self.redraw()

    def on_right_click(self, event):
        idx = self.find_clicked(event) # looks at coordinates clicked and checks if there is a data point there
        if idx == self.neighbor_idx: 
            self.neighbor_idx = None
        else:
            self.neighbor_idx = idx
        self.redraw()

    def find_clicked(self, event): # loop through all data points and checks if the click hit any
        if self.df is None: return None
        for i, row in self.df.iterrows():
            px, py = self.get_pixel_coords(row[0], row[1]) 
            if math.sqrt((event.x - px)**2 + (event.y - py)**2) < 10: # is the difference between the clicked pixel and data point < 10 pixels
                return i
        return None

    def redraw(self):
        self.canvas.delete("all")
        if self.df is None: return

        # Min and max values of the data
        x_min, x_max = self.df[0].min(), self.df[0].max()
        y_min, y_max = self.df[1].min(), self.df[1].max()
        
        # Set origin to where min values meet
        orig_val_x, orig_val_y = x_min, y_min
        # Update origin to clicked data point
        if self.origin_idx is not None:
            orig_val_x = self.df.iloc[self.origin_idx][0] # looks at the index of the data point and grabs row 0 value (x value)
            orig_val_y = self.df.iloc[self.origin_idx][1] # looks at the index of the data point and grabs row 1 value (y value)

        xAxis_px, yAxis_py = self.get_pixel_coords(orig_val_x, orig_val_y)
        self.canvas.create_line(self.pad/2, yAxis_py, self.width-self.pad/2, yAxis_py, fill="black", width=1) # X-axis (x1, y1, x2, y2)
        self.canvas.create_line(xAxis_px, self.height-self.pad/2, xAxis_px, self.pad/2, fill="black", width=1) # Y-axis (x1, y1, x2, y2)
        
        # Draw the Ticks (labels under the axis)
        for i in range(20):
            vx = x_min + i * (x_max - x_min) / 19
            vy = y_min + i * (y_max - y_min) / 19
            tx, ty = self.get_pixel_coords(vx, vy)
            self.canvas.create_text(tx, self.height-20, text=f"{vx:.1f}", font=("Arial", 8))
            self.canvas.create_text(25, ty, text=f"{vy:.1f}", font=("Arial", 8))

        # Nearest Neighbors Calculation
        neighbors = [] # create empty array for neighbor data points
        if self.neighbor_idx is not None:
            ref = self.df.iloc[self.neighbor_idx]
            dists = [] # create empty array for distances
            for i, row in self.df.iterrows():
                if i == self.neighbor_idx: continue
                d = math.sqrt((row[0]-ref[0])**2 + (row[1]-ref[1])**2)
                dists.append((d, i))
            dists.sort()
            neighbors = [idx for d, idx in dists[:5]] # grabs 5 smallest distances, and creates a new array with only the indexes 

        # 3. Draw Points
        for i, row in self.df.iterrows():
            px, py = self.get_pixel_coords(row[0], row[1])
            
            # Quadrant color logic when a point is pressed
            color = "#bdc3c7" # Default Grey
            if self.origin_idx is not None:
                ref = self.df.iloc[self.origin_idx]
                if row[0] >= ref[0] and row[1] >= ref[1]: color = "#2ecc71" # Green (Top-Right)
                elif row[0] < ref[0] and row[1] >= ref[1]: color = "#3498db" # Blue (Top-Left)
                elif row[0] < ref[0] and row[1] < ref[1]: color = "#9b59b6" # Purple (Bottom-Left)
                else: color = "#e74c3c" # Red (Bottom-Right)
            
            # Highlight Neighbors
            if i in neighbors: color = "#f1c40f" # Yellow

            # Stroke for selected points
            outline, thickness = "black", 1
            if i == self.origin_idx or i == self.neighbor_idx:
                color, outline, thickness = "black", "#1abc9c", 2 # Cyan highlight

            self.draw_shape(px, py, self.shape_map[row[2]], color, outline, thickness)

        self.draw_legend()

if __name__ == "__main__":
    root = tk.Tk()
    app = ScatterPlot(root)
    root.mainloop()